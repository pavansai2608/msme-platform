const router = require('express').Router();
const { verifyToken, allowRoles } = require('../middleware/roleMiddleware');
const User = require('../models/User');
const MSMEData = require('../models/MSMEData');

// Get all users
router.get('/users', verifyToken, allowRoles('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Platform stats
router.get('/stats', verifyToken, allowRoles('admin'), async (req, res) => {
  const totalMSMEs      = await User.countDocuments({ role: 'msme' });
  const totalSuppliers  = await User.countDocuments({ role: 'supplier' });
  const totalDataPoints = await MSMEData.countDocuments();
  const stateBreakdown  = await User.aggregate([
    { $match: { role: 'msme' } },
    { $group: { _id: '$state', count: { $sum: 1 } } }
  ]);
  const clusterBreakdown = await User.aggregate([
    { $match: { role: 'msme' } },
    { $group: { _id: '$cluster', count: { $sum: 1 } } }
  ]);
  res.json({ totalMSMEs, totalSuppliers, totalDataPoints, stateBreakdown, clusterBreakdown });
});

// Approve user
router.put('/approve/:id', verifyToken, allowRoles('admin'), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ message: 'User approved' });
});

module.exports = router;
