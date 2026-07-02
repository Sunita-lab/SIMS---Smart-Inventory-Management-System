const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);