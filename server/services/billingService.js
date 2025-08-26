const InvoiceGenerator = require('../utils/invoiceGenerator');
const UserSubscription = require('../models/UserSubscription');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

class BillingService {
  constructor() {
    this.invoiceGenerator = new InvoiceGenerator();
  }

  // Generate invoice for a subscription
  async generateInvoice(userSubscriptionId) {
    try {
      const userSubscription = await UserSubscription.findById(userSubscriptionId)
        .populate('subscription')
        .populate('user', 'name email');

      if (!userSubscription) {
        throw new Error('User subscription not found');
      }

      const invoiceData = {
        invoiceNumber: this.generateInvoiceNumber(),
        invoiceDate: new Date(),
        dueDate: new Date(userSubscription.endDate),
        customerInfo: {
          name: userSubscription.user.name,
          email: userSubscription.user.email,
          address: userSubscription.user.address || 'N/A'
        },
        subscriptionInfo: {
          name: userSubscription.subscription.name,
          description: userSubscription.subscription.description,
          billingCycle: userSubscription.billingCycle,
          startDate: userSubscription.startDate,
          endDate: userSubscription.endDate
        },
        billingDetails: [
          {
            name: 'Subscription Fee',
            description: `${userSubscription.subscription.name} - ${userSubscription.billingCycle}`,
            amount: userSubscription.amount
          }
        ],
        totalAmount: userSubscription.amount,
        currency: userSubscription.currency || 'USD'
      };

      return invoiceData;
    } catch (error) {
      throw new Error(`Failed to generate invoice: ${error.message}`);
    }
  }

  // Generate PDF invoice
  async generatePDFInvoice(userSubscriptionId) {
    try {
      const invoiceData = await this.generateInvoice(userSubscriptionId);
      const pdfBuffer = await this.invoiceGenerator.generateInvoiceBuffer(invoiceData);
      
      return {
        buffer: pdfBuffer,
        filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
        invoiceData
      };
    } catch (error) {
      throw new Error(`Failed to generate PDF invoice: ${error.message}`);
    }
  }

  // Save invoice to file system
  async saveInvoiceToFile(userSubscriptionId, filename) {
    try {
      const invoiceData = await this.generateInvoice(userSubscriptionId);
      const filePath = await this.invoiceGenerator.saveInvoiceToFile(invoiceData, filename);
      
      return {
        filePath,
        invoiceData
      };
    } catch (error) {
      throw new Error(`Failed to save invoice to file: ${error.message}`);
    }
  }

  // Get comprehensive billing history for a user
  async getBillingHistory(userId) {
    try {
      const userSubscriptions = await UserSubscription.find({ user: userId })
        .populate('subscription')
        .sort({ startDate: -1 });

      const billingHistory = userSubscriptions.map(sub => ({
        _id: sub._id,
        date: sub.startDate,
        description: `${sub.subscription.name} - ${sub.billingCycle} subscription`,
        amount: sub.amount,
        currency: sub.currency || 'USD',
        status: sub.paymentStatus || 'pending',
        billingCycle: sub.billingCycle,
        startDate: sub.startDate,
        endDate: sub.endDate,
        subscriptionName: sub.subscription.name,
        subscriptionType: sub.subscription.type,
        invoiceNumber: this.generateInvoiceNumberFromId(sub._id)
      }));

      return billingHistory;
    } catch (error) {
      throw new Error(`Failed to get billing history: ${error.message}`);
    }
  }

  // Process payment and update subscription status
  async processPayment(userSubscriptionId, paymentDetails) {
    try {
      const userSubscription = await UserSubscription.findById(userSubscriptionId);
      
      if (!userSubscription) {
        throw new Error('User subscription not found');
      }

      // Update payment status
      userSubscription.paymentStatus = 'paid';
      userSubscription.status = 'active';
      userSubscription.lastBillingDate = new Date();
      userSubscription.paymentMethod = paymentDetails.paymentMethod;
      
      // Calculate next billing date
      const nextBillingDate = new Date(userSubscription.endDate);
      if (userSubscription.billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (userSubscription.billingCycle === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
      
      userSubscription.nextBillingDate = nextBillingDate;
      userSubscription.endDate = nextBillingDate;
      
      await userSubscription.save();

      // Update user subscription status
      await User.findByIdAndUpdate(userSubscription.user, {
        subscriptionStatus: userSubscription.subscription.type,
        subscriptionExpiry: nextBillingDate
      });

      return userSubscription;
    } catch (error) {
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }

  // Generate recurring invoice for subscription renewal
  async generateRecurringInvoice(userSubscriptionId) {
    try {
      const userSubscription = await UserSubscription.findById(userSubscriptionId)
        .populate('subscription')
        .populate('user', 'name email');

      if (!userSubscription) {
        throw new Error('User subscription not found');
      }

      // Create new billing period
      const newStartDate = new Date(userSubscription.endDate);
      const newEndDate = new Date(newStartDate);
      
      if (userSubscription.billingCycle === 'monthly') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      } else if (userSubscription.billingCycle === 'yearly') {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      }

      // Create new user subscription record for the new billing period
      const newUserSubscription = await UserSubscription.create({
        user: userSubscription.user._id,
        subscription: userSubscription.subscription._id,
        billingCycle: userSubscription.billingCycle,
        startDate: newStartDate,
        endDate: newEndDate,
        amount: userSubscription.amount,
        paymentMethod: userSubscription.paymentMethod,
        status: 'pending',
        paymentStatus: 'pending',
        autoRenew: userSubscription.autoRenew
      });

      return newUserSubscription;
    } catch (error) {
      throw new Error(`Failed to generate recurring invoice: ${error.message}`);
    }
  }

  // Get upcoming billing information
  async getUpcomingBilling(userId) {
    try {
      const userSubscription = await UserSubscription.findOne({
        user: userId,
        status: 'active'
      }).populate('subscription');

      if (!userSubscription) {
        return null;
      }

      const nextBillingDate = userSubscription.nextBillingDate || userSubscription.endDate;
      const daysUntilBilling = Math.ceil((nextBillingDate - new Date()) / (1000 * 60 * 60 * 24));

      return {
        nextBillingDate,
        daysUntilBilling,
        amount: userSubscription.amount,
        currency: userSubscription.currency || 'USD',
        billingCycle: userSubscription.billingCycle,
        subscriptionName: userSubscription.subscription.name,
        autoRenew: userSubscription.autoRenew
      };
    } catch (error) {
      throw new Error(`Failed to get upcoming billing: ${error.message}`);
    }
  }

  // Generate unique invoice number
  generateInvoiceNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  }

  // Generate invoice number from subscription ID
  generateInvoiceNumberFromId(subscriptionId) {
    const timestamp = Date.now();
    const shortId = subscriptionId.toString().slice(-6);
    return `INV-${timestamp}-${shortId}`;
  }

  // Calculate prorated amount for plan changes
  calculateProratedAmount(currentSubscription, newSubscription, changeDate) {
    try {
      const currentEndDate = new Date(currentSubscription.endDate);
      const changeDateObj = new Date(changeDate);
      
      // Calculate remaining days in current billing period
      const remainingDays = Math.ceil((currentEndDate - changeDateObj) / (1000 * 60 * 60 * 24));
      const totalDays = Math.ceil((currentEndDate - new Date(currentSubscription.startDate)) / (1000 * 60 * 60 * 24));
      
      // Calculate prorated refund for current plan
      const dailyRate = currentSubscription.amount / totalDays;
      const proratedRefund = dailyRate * remainingDays;
      
      // Calculate prorated charge for new plan
      const newPlanDailyRate = newSubscription.price / 30; // Assuming monthly billing
      const proratedCharge = newPlanDailyRate * remainingDays;
      
      return {
        proratedRefund: Math.max(0, proratedRefund),
        proratedCharge: Math.max(0, proratedCharge),
        netAmount: proratedCharge - proratedRefund
      };
    } catch (error) {
      throw new Error(`Failed to calculate prorated amount: ${error.message}`);
    }
  }
}

module.exports = new BillingService();