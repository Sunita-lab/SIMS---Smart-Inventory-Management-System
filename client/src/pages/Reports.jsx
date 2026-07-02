import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FF6699'];

function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get('/reports');
        setReports(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading reports...</p>;
  if (!reports) return <p style={{ padding: '20px' }}>No data available</p>;

  const categoryData = Object.entries(reports.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Reports & Analytics</h2>

        {/* Summary Cards */}
        <div style={{ display: 'flex', gap: '16px', margin: '20px 0' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', flex: 1 }}>
            <p>Total Products</p>
            <h3>{reports.totalProducts}</h3>
          </div>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', flex: 1 }}>
            <p>Total Inventory Value</p>
            <h3>₹{reports.totalInventoryValue}</h3>
          </div>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', flex: 1 }}>
            <p>Low Stock Items</p>
            <h3>{reports.lowStockProducts.length}</h3>
          </div>
        </div>

        {/* Category Breakdown - Pie Chart */}
        <h3>Products by Category</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No category data</p>
        )}

        {/* Supplier Breakdown - Bar Chart */}
        <h3>Products per Supplier</h3>
        {reports.supplierBreakdown.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.supplierBreakdown}>
              <XAxis dataKey="supplierName" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="productCount" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No supplier data</p>
        )}

        {/* Low Stock Table */}
        <h3>Low Stock Report</h3>
        {reports.lowStockProducts.length > 0 ? (
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {reports.lowStockProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.quantity}</td>
                  <td>{p.lowStockThreshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No low stock items 🎉</p>
        )}
      </div>
    </div>
  );
}

export default Reports;