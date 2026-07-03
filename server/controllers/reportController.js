const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const InventoryLog = require('../models/InventoryLog');

const getReports = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier', 'name');

    // Low stock report
    const lowStockProducts = products.filter(
      (p) => p.quantity <= p.lowStockThreshold
    );

    // Total inventory value
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    // Category breakdown (count)
    const categoryBreakdown = {};
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });

    // Category value breakdown (sum of price*qty per category)
    const categoryValueBreakdown = {};
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      categoryValueBreakdown[cat] = (categoryValueBreakdown[cat] || 0) + p.price * p.quantity;
    });

    // Supplier breakdown (count)
    const suppliers = await Supplier.find();
    const supplierBreakdown = await Promise.all(
      suppliers.map(async (s) => {
        const supplierProducts = products.filter(
          (p) => p.supplier && p.supplier._id.toString() === s._id.toString()
        );
        const totalValue = supplierProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
        return {
          supplierName: s.name,
          productCount: supplierProducts.length,
          totalValue,
        };
      })
    );

    // Product Summary (all products with computed value)
    const productSummary = products.map((p) => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category || 'Uncategorized',
      price: p.price,
      quantity: p.quantity,
      value: p.price * p.quantity,
      supplierName: p.supplier?.name || '—',
    }));

    // Top 5 products by value
    const topProducts = [...productSummary]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Recent activity (last 8 inventory logs)
    const recentActivity = await InventoryLog.find()
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      lowStockProducts,
      totalInventoryValue,
      categoryBreakdown,
      categoryValueBreakdown,
      supplierBreakdown,
      productSummary,
      topProducts,
      recentActivity,
      totalProducts: products.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports };