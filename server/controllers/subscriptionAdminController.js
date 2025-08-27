const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');

exports.getPlans = asyncHandler(async (req, res) => {
  const plans = await Subscription.find().sort('-createdAt');
  res.status(200).json({ success: true, data: plans });
});

exports.createPlan = asyncHandler(async (req, res, next) => {
  const plan = await Subscription.create(req.body);
  res.status(201).json({ success: true, data: plan });
});

exports.updatePlan = asyncHandler(async (req, res, next) => {
  const plan = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!plan) return next(new ErrorResponse('Plan not found', 404));
  res.status(200).json({ success: true, data: plan });
});

exports.deletePlan = asyncHandler(async (req, res, next) => {
  const plan = await Subscription.findByIdAndDelete(req.params.id);
  if (!plan) return next(new ErrorResponse('Plan not found', 404));
  res.status(200).json({ success: true, data: {} });
});

exports.getAllSubscriptions = asyncHandler(async (req, res) => {
  const subs = await UserSubscription.find()
    .populate('user', 'name email')
    .populate('subscription', 'name type')
    .sort('-createdAt');

  // Normalize fields for admin UI expectations
  const data = subs.map(s => ({
    _id: s._id,
    user: s.user,
    plan: { name: s.subscription?.name, type: s.subscription?.type },
    amount: s.amount,
    currency: s.currency,
    status: s.status,
    startDate: s.startDate,
    endDate: s.endDate,
    createdAt: s.createdAt
  }));

  res.status(200).json({ success: true, data });
});

exports.updateSubscriptionStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const allowed = ['active', 'cancelled', 'expired', 'pending', 'suspended'];
  if (!allowed.includes(status)) return next(new ErrorResponse('Invalid status', 400));

  const sub = await UserSubscription.findById(req.params.id);
  if (!sub) return next(new ErrorResponse('Subscription not found', 404));

  sub.status = status;
  if (status === 'cancelled') sub.autoRenew = false;
  await sub.save();

  res.status(200).json({ success: true, data: sub });
});

