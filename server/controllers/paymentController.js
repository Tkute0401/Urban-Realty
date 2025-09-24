const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { createRazorpayInstance, verifyRazorpaySignature } = require('../utils/razorpay');
const { validationResult } = require('express-validator');

// @desc    Get Razorpay public key
// @route   GET /api/v1/subscriptions/razorpay/key
// @access  Private
exports.getRazorpayKey = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});

// @desc    Create Razorpay order for a subscription
// @route   POST /api/v1/subscriptions/razorpay/order
// @access  Private
exports.createRazorpayOrder = asyncHandler(async (req, res, next) => {
  console.log('🔵 CREATE RAZORPAY ORDER - Request Body:', req.body);
  console.log('🔵 CREATE RAZORPAY ORDER - User ID:', req.user?.id);
  
  // Check express-validator errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Express Validator Errors:', errors.array());
    return next(new ErrorResponse(`Validation error: ${errors.array().map(e => e.msg).join(', ')}`, 400));
  }
  
  const { subscriptionId, billingCycle } = req.body;
  const userId = req.user.id;
  
  // Validate input
  if (!subscriptionId || !billingCycle) {
    console.log('❌ Validation failed - Missing required fields:', { subscriptionId, billingCycle });
    return next(new ErrorResponse('Missing required fields: subscriptionId and billingCycle', 400));
  }
  
  if (!['monthly', 'yearly'].includes(billingCycle)) {
    console.log('❌ Validation failed - Invalid billing cycle:', billingCycle);
    return next(new ErrorResponse('Invalid billing cycle. Must be monthly or yearly', 400));
  }

  console.log('🔍 Finding subscription with ID:', subscriptionId);
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    console.log('❌ Subscription not found:', subscriptionId);
    return next(new ErrorResponse('Subscription not found', 404));
  }
  console.log('✅ Subscription found:', subscription.name, 'Price:', subscription.price);

  // Calculate amount
  let amount = subscription.price;
  if (billingCycle === 'yearly') {
    amount = subscription.price * 12 * 0.8; // 20% discount for yearly
  }
  console.log('💰 Calculated amount:', amount, 'Billing cycle:', billingCycle);

  let order;
  try {
    console.log('🔧 Creating Razorpay instance...');
    const instance = createRazorpayInstance();
    console.log('✅ Razorpay instance created successfully');
    
    // Generate a short receipt (max 40 chars for Razorpay)
    const shortReceipt = `sub_${Date.now().toString().slice(-8)}`;
    
    console.log('📋 Creating Razorpay order with:', {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: shortReceipt,
      notes: { userId, subscriptionId, billingCycle }
    });
    
    // Use callback approach for Razorpay order creation
    order = await new Promise((resolve, reject) => {
      console.log('🔧 About to call instance.orders.create...');
      instance.orders.create({
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        receipt: shortReceipt,
        notes: { userId, subscriptionId, billingCycle }
      }, (err, razorpayOrder) => {
        console.log('📞 Razorpay callback executed!');
        console.log('📞 Error parameter:', err);
        console.log('📞 Order parameter:', razorpayOrder);
        console.log('📞 Error type:', typeof err);
        console.log('📞 Order type:', typeof razorpayOrder);
        
        if (err) {
          console.error('❌ Razorpay callback has error - rejecting:', err);
          reject(err);
        } else if (!razorpayOrder) {
          console.error('❌ Razorpay callback has no order - rejecting with custom error');
          reject(new Error('Razorpay order creation returned no order object'));
        } else {
          console.log('✅ Razorpay order created successfully, resolving with:', razorpayOrder.id);
          resolve(razorpayOrder);
        }
      });
      console.log('🔧 instance.orders.create called, waiting for callback...');
    });
  } catch (razorpayError) {
    console.error('❌ Razorpay Error Object:', razorpayError);
    console.error('❌ Razorpay Error Message:', razorpayError.message);
    console.error('❌ Razorpay Error Stack:', razorpayError.stack);
    const errorMessage = razorpayError.message 
      || razorpayError.error?.description 
      || razorpayError.error?.code 
      || (razorpayError.statusCode ? `Status ${razorpayError.statusCode}` : null)
      || JSON.stringify(razorpayError) 
      || 'Unknown Razorpay error';
    return next(new ErrorResponse(`Razorpay order creation failed: ${errorMessage}`, 500));
  }

  // Create pending user subscription linked to order
  const startDate = new Date();
  const endDate = new Date(startDate);
  if (billingCycle === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
  else if (billingCycle === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);

  const userSubscription = await UserSubscription.create({
    user: userId,
    subscription: subscriptionId,
    billingCycle,
    startDate,
    endDate,
    amount,
    currency: 'INR',
    paymentMethod: 'razorpay',
    status: 'pending',
    paymentStatus: 'pending',
    razorpayOrderId: order.id
  });

  await User.findByIdAndUpdate(userId, {
    currentSubscription: userSubscription._id,
    subscriptionStatus: subscription.type,
    subscriptionExpiry: endDate
  });

  res.status(201).json({ success: true, order, subscription: userSubscription });
});

// @desc    Verify Razorpay payment signature and activate subscription
// @route   POST /api/v1/subscriptions/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new ErrorResponse('Missing Razorpay verification parameters', 400));
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });

  if (!isValid) {
    return next(new ErrorResponse('Invalid payment signature', 400));
  }

  const userSubscription = await UserSubscription.findOne({ razorpayOrderId: razorpay_order_id });
  if (!userSubscription) {
    return next(new ErrorResponse('Subscription record not found for this order', 404));
  }

  userSubscription.razorpayPaymentId = razorpay_payment_id;
  userSubscription.razorpaySignature = razorpay_signature;
  userSubscription.paymentStatus = 'paid';
  userSubscription.status = 'active';
  userSubscription.lastBillingDate = new Date();

  // Align next billing/end date for active period
  const nextBillingDate = new Date(userSubscription.endDate);
  if (userSubscription.billingCycle === 'monthly') nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  else if (userSubscription.billingCycle === 'yearly') nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  userSubscription.nextBillingDate = nextBillingDate;

  await userSubscription.save();

  await User.findByIdAndUpdate(userSubscription.user, {
    subscriptionStatus: (await Subscription.findById(userSubscription.subscription)).type,
    subscriptionExpiry: userSubscription.endDate
  });

  res.status(200).json({ success: true, data: userSubscription });
});

