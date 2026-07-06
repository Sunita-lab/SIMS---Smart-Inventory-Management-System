const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const InventoryLog = require('../models/InventoryLog');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    const products = await Product.find();
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

    const lowStockProducts = products.filter(
      (p) => p.quantity <= p.lowStockThreshold
    );

    const recentActivity = await InventoryLog.find()
      .sort({ createdAt: -1 })
      .limit(4);

    res.json({
      totalProducts,
      totalSuppliers,
      totalStock,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5), // top 5 for widget
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };