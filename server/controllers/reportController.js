const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

const getReports = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier', 'name');

    // Low stock report
    const lowStockProducts = products.filter(
      (p) => p.quantity <= p.lowStockThreshold
    );

    // Product summary: total inventory value, category-wise count
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const categoryBreakdown = {};
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });

    // Supplier summary: product count per supplier
    const suppliers = await Supplier.find();
    const supplierBreakdown = await Promise.all(
      suppliers.map(async (s) => {
        const count = await Product.countDocuments({ supplier: s._id });
        return { supplierName: s.name, productCount: count };
      })
    );

    res.json({
      lowStockProducts,
      totalInventoryValue,
      categoryBreakdown,
      supplierBreakdown,
      totalProducts: products.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports };