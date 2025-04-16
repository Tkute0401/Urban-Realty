
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const DynamicField = require('../models/DynamicField');

// @desc    Get all dynamic fields
// @route   GET /api/v1/admin/fields
// @access  Private/Admin
exports.getFields = asyncHandler(async (req, res, next) => {
  const fields = await DynamicField.find().sort('entityType order');
  
  res.status(200).json({
    success: true,
    count: fields.length,
    data: fields
  });
});

// @desc    Get dynamic fields by entity type
// @route   GET /api/v1/admin/fields/:entityType
// @access  Private/Admin
exports.getFieldsByEntity = asyncHandler(async (req, res, next) => {
  const fields = await DynamicField.find({ entityType: req.params.entityType }).sort('order');
  
  res.status(200).json({
    success: true,
    count: fields.length,
    data: fields
  });
});

// @desc    Create dynamic field
// @route   POST /api/v1/admin/fields
// @access  Private/Admin
exports.createField = asyncHandler(async (req, res, next) => {
  const field = await DynamicField.create(req.body);
  
  res.status(201).json({
    success: true,
    data: field
  });
});

// @desc    Update dynamic field
// @route   PUT /api/v1/admin/fields/:id
// @access  Private/Admin
exports.updateField = asyncHandler(async (req, res, next) => {
  let field = await DynamicField.findById(req.params.id);
  
  if (!field) {
    return next(
      new ErrorResponse(`Field not found with id of ${req.params.id}`, 404)
    );
  }
  
  field = await DynamicField.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: field
  });
});

// @desc    Delete dynamic field
// @route   DELETE /api/v1/admin/fields/:id
// @access  Private/Admin
exports.deleteField = asyncHandler(async (req, res, next) => {
  const field = await DynamicField.findByIdAndDelete(req.params.id);
  
  if (!field) {
    return next(
      new ErrorResponse(`Field not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reorder fields
// @route   PUT /api/v1/admin/fields/reorder
// @access  Private/Admin
exports.reorderFields = asyncHandler(async (req, res, next) => {
  const { entityType, fieldOrders } = req.body;
  
  const bulkOps = fieldOrders.map(item => ({
    updateOne: {
      filter: { _id: item.id, entityType },
      update: { $set: { order: item.order } }
    }
  }));
  
  await DynamicField.bulkWrite(bulkOps);
  
  const fields = await DynamicField.find({ entityType }).sort('order');
  
  res.status(200).json({
    success: true,
    data: fields
  });
});