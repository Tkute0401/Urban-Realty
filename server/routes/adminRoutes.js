// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/users/:id/role')
  .put(updateUserRole);

router.route('/properties')
  .get(getAllProperties);

router.route('/properties/:id')
  .delete(deleteProperty);

router.route('/properties/:id/featured')
  .patch(toggleFeatured);

router.route('/inquiries')
  .get(getInquiries);

router.route('/inquiries/:id/status')
  .patch(updateInquiryStatus);

module.exports = router;