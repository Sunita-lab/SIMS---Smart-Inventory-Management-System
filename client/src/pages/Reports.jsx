import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, IndianRupee, AlertTriangle, ArrowUpCircle, ArrowDownCircle, LayoutGrid, BarChart3, Boxes, Users, TriangleAlert } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'charts', label: 'Charts', icon: BarChart3 },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'suppliers', label: 'Suppliers', icon: Users },
  { id: 'lowstock', label: 'Low Stock', icon: TriangleAlert },
];

function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  if (loading) return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <p className="p-10 text-slate-500">Loading reports...</p>
    </div>
  );
  if (!reports) return null;

  const categoryData = Object.entries(reports.categoryBreakdown).map(([name, value]) => ({ name, value }));
  const categoryValueData = Object.entries(reports.categoryValueBreakdown).map(([name, value]) => ({ name, value }));

  const summaryCards = [
    { title: 'Total Products', value: reports.totalProducts, icon: <Package className="w-6 h-6 text-white" />, gradient: 'from-indigo-500 to-indigo-700' },
    { title: 'Total Inventory Value', value: `₹${reports.totalInventoryValue}`, icon: <IndianRupee className="w-6 h-6 text-white" />, gradient: 'from-emerald-500 to-emerald-700' },
    { title: 'Low Stock Items', value: reports.lowStockProducts.length, icon: <AlertTriangle className="w-6 h-6 text-white" />, gradient: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-slate-500 mt-1">Insights into your inventory performance.</p>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full mt-3"></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {summaryCards.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className={`bg-gradient-to-br ${c.gradient} p-5`}>
                    <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      {c.icon}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-500 text-sm">{c.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{c.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800">Recent Activity</h3>
              </div>
              {reports.recentActivity.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {reports.recentActivity.map((log) => (
                    <div key={log._id} className="px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {log.changeType === 'increase' ? (
                          <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ArrowDownCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm text-slate-700">
                          <span className="font-medium">{log.productName}</span>{' '}
                          {log.changeType === 'increase' ? 'increased by' : 'decreased by'}{' '}
                          <span className="font-medium">{log.changeAmount}</span> by {log.updatedByName}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-6 text-slate-500">No recent activity.</p>
              )}
            </div>
          </>
        )}

        {/* Tab: Charts */}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Products by Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm">No category data</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Products per Supplier</h3>
              {reports.supplierBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={reports.supplierBreakdown}>
                    <XAxis dataKey="supplierName" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="productCount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm">No supplier data</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Inventory Value by Category</h3>
              {categoryValueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryValueData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm">No data</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Top 5 Products by Value</h3>
              {reports.topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={reports.topProducts} layout="vertical">
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm">No data</p>
              )}
            </div>
          </div>
        )}

        {/* Tab: Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Product Summary</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Category</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Price</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Quantity</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Value</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.productSummary.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-3 text-slate-600">{p.category}</td>
                    <td className="px-6 py-3 text-slate-600">₹{p.price}</td>
                    <td className="px-6 py-3 text-slate-600">{p.quantity}</td>
                    <td className="px-6 py-3 font-medium text-emerald-700">₹{p.value}</td>
                    <td className="px-6 py-3 text-slate-600">{p.supplierName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Suppliers */}
        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Supplier Summary</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Supplier</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Product Count</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.supplierBreakdown.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{s.supplierName}</td>
                    <td className="px-6 py-3 text-slate-600">{s.productCount}</td>
                    <td className="px-6 py-3 font-medium text-emerald-700">₹{s.totalValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Low Stock */}
        {activeTab === 'lowstock' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Low Stock Report</h3>
            </div>
            {reports.lowStockProducts.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">SKU</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Quantity</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.lowStockProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                      <td className="px-6 py-4 text-slate-600">{p.sku}</td>
                      <td className="px-6 py-4">
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{p.lowStockThreshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-slate-500">No low stock items 🎉</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;