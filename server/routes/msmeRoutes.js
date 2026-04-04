const router = require('express').Router();
const { verifyToken, allowRoles } = require('../middleware/roleMiddleware');
const MSMEData = require('../models/MSMEData');
const axios = require('axios');

// Submit monthly data
router.post('/data', verifyToken, allowRoles('msme'), async (req, res) => {
  try {
    const data = await MSMEData.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Data saved', data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my data
router.get('/data', verifyToken, allowRoles('msme'), async (req, res) => {
  const data = await MSMEData.find({ userId: req.user.id }).sort({ month: -1 });
  res.json(data);
});

// Get AI forecast from Flask
router.get('/forecast', verifyToken, allowRoles('msme'), async (req, res) => {
  try {
    const response = await axios.post(`${process.env.FLASK_URL}/forecast`, { periods: 3 });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'AI service error', error: err.message });
  }
});

// Get AI insights from Flask
router.post('/insights', verifyToken, allowRoles('msme'), async (req, res) => {
  try {
    const myData = await MSMEData.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    const response = await axios.post(`${process.env.FLASK_URL}/insights`, {
      sales_revenue: myData?.salesRevenue || 0,
      inventory_qty: myData?.inventoryQty || 0,
      cluster: req.user.cluster,
      state: req.user.state
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Insights error', error: err.message });
  }
});

// Get eligible government schemes
router.post('/schemes', verifyToken, allowRoles('msme'), async (req, res) => {
  try {
    const response = await axios.post(`${process.env.FLASK_URL}/schemes`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Schemes error', error: err.message });
  }
});

module.exports = router;
