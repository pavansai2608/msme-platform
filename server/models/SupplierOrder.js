const mongoose = require('mongoose');

const supplierOrderSchema = new mongoose.Schema({
  supplierId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  msmeId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productType: { type: String },
  quantityKg:  { type: Number },
  pricePerKg:  { type: Number },
  cluster:     { type: String },
  state:       { type: String },
  status:      { type: String, enum: ['pending', 'accepted', 'delivered'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('SupplierOrder', supplierOrderSchema);
