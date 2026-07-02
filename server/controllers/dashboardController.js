const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    const products = await Product.find();
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

    const lowStockCount = products.filter(
      (p) => p.quantity <= p.lowStockThreshold
    ).length;

    res.json({
      totalProducts,
      totalSuppliers,
      totalStock,
      lowStockCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };