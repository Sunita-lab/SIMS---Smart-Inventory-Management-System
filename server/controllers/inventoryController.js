const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');

// Adjust stock (increase or decrease)
const adjustStock = async (req, res) => {
  try {
    const { productId, changeType, amount } = req.body;

    if (!['increase', 'decrease'].includes(changeType)) {
      return res.status(400).json({ message: 'Invalid change type' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const previousQuantity = product.quantity;
    let newQuantity;

    if (changeType === 'increase') {
      newQuantity = previousQuantity + Number(amount);
    } else {
      newQuantity = previousQuantity - Number(amount);
      if (newQuantity < 0) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    }

    product.quantity = newQuantity;
    await product.save();

    const log = await InventoryLog.create({
      product: product._id,
      productName: product.name,
      previousQuantity,
      newQuantity,
      changeType,
      changeAmount: Number(amount),
      updatedBy: req.user._id,
      updatedByName: req.user.name,
    });

    res.status(201).json({ product, log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all logs
const getLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { adjustStock, getLogs };