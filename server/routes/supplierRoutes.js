const router = require('express').Router();
const { verifyToken, allowRoles } = require('../middleware/roleMiddleware');
const SupplierOrder = require('../models/SupplierOrder');
const MSMEData = require('../models/MSMEData');

// See aggregated MSME demand
router.get('/demand', verifyToken, allowRoles('supplier'), async (req, res) => {
  const demand = await MSMEData.aggregate([
    { $group: {
      _id: { productType: '$productType', cluster: '$cluster', state: '$state' },
      totalDemand: { $sum: '$inventoryQty' },
      count: { $sum: 1 }
    }}
  ]);
  res.json(demand);
});

// Submit price quote
router.post('/quote', verifyToken, allowRoles('supplier'), async (req, res) => {
  const order = await SupplierOrder.create({ ...req.body, supplierId: req.user.id });
  res.status(201).json({ message: 'Quote submitted', order });
});

// Get my orders
router.get('/orders', verifyToken, allowRoles('supplier'), async (req, res) => {
  const orders = await SupplierOrder.find({ supplierId: req.user.id });
  res.json(orders);
});

module.exports = router;
