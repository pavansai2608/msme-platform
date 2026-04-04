const mongoose = require('mongoose');

const msmeDataSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  month:           { type: String },
  salesRevenue:    { type: Number },
  inventoryQty:    { type: Number },
  rawMaterialCost: { type: Number },
  productType:     { type: String },
  exportShare:     { type: Number },
  cluster:         { type: String },
  state:           { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MSMEData', msmeDataSchema);
