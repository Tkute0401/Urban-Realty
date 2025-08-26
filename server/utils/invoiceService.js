const Invoice = require('../models/Invoice');
const UserSubscription = require('../models/UserSubscription');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

/**
 * Generate invoice for subscription
 * @param {Object} userSubscription - User subscription object
 * @param {string} invoiceType - Type of invoice (initial, renewal, upgrade, downgrade)
 * @param {Object} options - Additional options
 * @returns {Object} Generated invoice
 */
const generateInvoice = async (userSubscription, invoiceType = 'initial', options = {}) => {
  try {
    const subscription = await Subscription.findById(userSubscription.subscription);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const user = await User.findById(userSubscription.user);
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate billing period
    const startDate = new Date(userSubscription.startDate);
    const endDate = new Date(userSubscription.endDate);
    
    // Calculate due date (7 days from invoice creation)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Calculate amounts
    let subtotal = userSubscription.amount;
    let discount = 0;
    let tax = 0;

    // Apply yearly discount if applicable
    if (userSubscription.billingCycle === 'yearly') {
      const monthlyPrice = subscription.price;
      const yearlyPrice = monthlyPrice * 12;
      const discountedYearlyPrice = yearlyPrice * 0.8; // 20% discount
      discount = yearlyPrice - discountedYearlyPrice;
      subtotal = discountedYearlyPrice;
    }

    // Calculate tax (example: 8.5% tax rate)
    tax = subtotal * 0.085;

    const total = subtotal + tax - discount;

    // Create invoice items
    const items = [{
      description: `${subscription.name} - ${userSubscription.billingCycle} subscription`,
      quantity: 1,
      unitPrice: userSubscription.amount,
      amount: userSubscription.amount
    }];

    // Add discount item if applicable
    if (discount > 0) {
      items.push({
        description: 'Yearly subscription discount',
        quantity: 1,
        unitPrice: -discount,
        amount: -discount
      });
    }

    // Add tax item
    if (tax > 0) {
      items.push({
        description: 'Tax',
        quantity: 1,
        unitPrice: tax,
        amount: tax
      });
    }

    // Create invoice
    const invoice = await Invoice.create({
      user: userSubscription.user,
      userSubscription: userSubscription._id,
      subscription: userSubscription.subscription,
      amount: userSubscription.amount,
      currency: userSubscription.currency || 'USD',
      billingCycle: userSubscription.billingCycle,
      invoiceType,
      status: 'draft',
      dueDate,
      billingPeriod: {
        startDate,
        endDate
      },
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: userSubscription.paymentMethod,
      notes: options.notes || '',
      metadata: {
        ...options.metadata,
        originalAmount: userSubscription.amount,
        billingCycle: userSubscription.billingCycle
      }
    });

    return invoice;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

/**
 * Handle subscription upgrade with proration
 * @param {string} userId - User ID
 * @param {string} newSubscriptionId - New subscription ID
 * @param {string} billingCycle - New billing cycle
 * @returns {Object} Result of upgrade operation
 */
const handleSubscriptionUpgrade = async (userId, newSubscriptionId, billingCycle) => {
  try {
    // Get current subscription
    const currentSubscription = await UserSubscription.findOne({
      user: userId,
      status: 'active'
    }).populate('subscription');

    if (!currentSubscription) {
      throw new Error('No active subscription found');
    }

    // Get new subscription
    const newSubscription = await Subscription.findById(newSubscriptionId);
    if (!newSubscription) {
      throw new Error('New subscription not found');
    }

    // Calculate proration
    const now = new Date();
    const daysRemaining = Math.ceil((currentSubscription.endDate - now) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((currentSubscription.endDate - currentSubscription.startDate) / (1000 * 60 * 60 * 24));
    
    const unusedAmount = (currentSubscription.amount / totalDays) * daysRemaining;
    const newAmount = billingCycle === 'yearly' ? newSubscription.price * 12 * 0.8 : newSubscription.price;
    const prorationCredit = unusedAmount;
    const finalAmount = Math.max(0, newAmount - prorationCredit);

    // Cancel current subscription
    currentSubscription.status = 'cancelled';
    currentSubscription.autoRenew = false;
    await currentSubscription.save();

    // Create new subscription
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const newUserSubscription = await UserSubscription.create({
      user: userId,
      subscription: newSubscriptionId,
      billingCycle,
      startDate,
      endDate,
      amount: newAmount,
      paymentMethod: currentSubscription.paymentMethod,
      status: 'pending',
      currency: currentSubscription.currency
    });

    // Generate upgrade invoice
    const upgradeInvoice = await generateInvoice(newUserSubscription, 'upgrade', {
      notes: `Upgrade from ${currentSubscription.subscription.name} to ${newSubscription.name}`,
      metadata: {
        previousSubscription: currentSubscription._id,
        prorationCredit,
        unusedAmount,
        daysRemaining
      }
    });

    // Update user
    await User.findByIdAndUpdate(userId, {
      currentSubscription: newUserSubscription._id,
      subscriptionStatus: newSubscription.type,
      subscriptionExpiry: endDate
    });

    return {
      success: true,
      newSubscription: newUserSubscription,
      invoice: upgradeInvoice,
      prorationCredit,
      finalAmount
    };
  } catch (error) {
    console.error('Error handling subscription upgrade:', error);
    throw error;
  }
};

/**
 * Handle subscription downgrade
 * @param {string} userId - User ID
 * @param {string} newSubscriptionId - New subscription ID
 * @param {string} billingCycle - New billing cycle
 * @returns {Object} Result of downgrade operation
 */
const handleSubscriptionDowngrade = async (userId, newSubscriptionId, billingCycle) => {
  try {
    // Get current subscription
    const currentSubscription = await UserSubscription.findOne({
      user: userId,
      status: 'active'
    }).populate('subscription');

    if (!currentSubscription) {
      throw new Error('No active subscription found');
    }

    // Get new subscription
    const newSubscription = await Subscription.findById(newSubscriptionId);
    if (!newSubscription) {
      throw new Error('New subscription not found');
    }

    // Calculate new amount
    const newAmount = billingCycle === 'yearly' ? newSubscription.price * 12 * 0.8 : newSubscription.price;

    // Cancel current subscription at end of billing period
    currentSubscription.autoRenew = false;
    await currentSubscription.save();

    // Create new subscription starting from next billing cycle
    const startDate = new Date(currentSubscription.endDate);
    const endDate = new Date(startDate);
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const newUserSubscription = await UserSubscription.create({
      user: userId,
      subscription: newSubscriptionId,
      billingCycle,
      startDate,
      endDate,
      amount: newAmount,
      paymentMethod: currentSubscription.paymentMethod,
      status: 'pending',
      currency: currentSubscription.currency
    });

    // Generate downgrade invoice
    const downgradeInvoice = await generateInvoice(newUserSubscription, 'downgrade', {
      notes: `Downgrade from ${currentSubscription.subscription.name} to ${newSubscription.name} - Effective from ${startDate.toLocaleDateString()}`,
      metadata: {
        previousSubscription: currentSubscription._id,
        effectiveDate: startDate
      }
    });

    return {
      success: true,
      newSubscription: newUserSubscription,
      invoice: downgradeInvoice,
      effectiveDate: startDate
    };
  } catch (error) {
    console.error('Error handling subscription downgrade:', error);
    throw error;
  }
};

/**
 * Get comprehensive billing details for user
 * @param {string} userId - User ID
 * @returns {Object} Billing details
 */
const getBillingDetails = async (userId) => {
  try {
    // Get current subscription
    const currentSubscription = await UserSubscription.findOne({
      user: userId,
      status: 'active'
    }).populate('subscription');

    // Get all invoices
    const invoices = await Invoice.find({ user: userId })
      .populate('subscription')
      .sort({ createdAt: -1 });

    // Get billing history
    const billingHistory = await UserSubscription.find({
      user: userId,
      status: { $in: ['active', 'cancelled', 'expired', 'pending'] }
    }).populate('subscription').sort({ createdAt: -1 });

    // Calculate totals
    const totalPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const totalOutstanding = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    const nextBillingDate = currentSubscription?.nextBillingDate || null;
    const nextBillingAmount = currentSubscription?.amount || 0;

    return {
      currentSubscription,
      invoices,
      billingHistory,
      summary: {
        totalPaid,
        totalOutstanding,
        nextBillingDate,
        nextBillingAmount,
        invoiceCount: invoices.length,
        activeInvoices: invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length
      }
    };
  } catch (error) {
    console.error('Error getting billing details:', error);
    throw error;
  }
};

/**
 * Mark invoice as paid
 * @param {string} invoiceId - Invoice ID
 * @param {string} transactionId - Payment transaction ID
 * @returns {Object} Updated invoice
 */
const markInvoiceAsPaid = async (invoiceId, transactionId) => {
  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.status = 'paid';
    invoice.paidDate = new Date();
    invoice.paymentTransactionId = transactionId;
    await invoice.save();

    // Update user subscription status if this is the first payment
    const userSubscription = await UserSubscription.findById(invoice.userSubscription);
    if (userSubscription && userSubscription.status === 'pending') {
      userSubscription.status = 'active';
      userSubscription.paymentStatus = 'paid';
      userSubscription.lastBillingDate = new Date();
      
      // Calculate next billing date
      const nextBillingDate = new Date(userSubscription.endDate);
      if (userSubscription.billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (userSubscription.billingCycle === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
      userSubscription.nextBillingDate = nextBillingDate;
      
      await userSubscription.save();
    }

    return invoice;
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    throw error;
  }
};

module.exports = {
  generateInvoice,
  handleSubscriptionUpgrade,
  handleSubscriptionDowngrade,
  getBillingDetails,
  markInvoiceAsPaid
};