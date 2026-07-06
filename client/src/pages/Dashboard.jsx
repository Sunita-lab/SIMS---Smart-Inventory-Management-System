import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, Boxes, AlertTriangle, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalStock: 0,
    lowStockCount: 0,
    lowStockProducts: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Products', value: stats.totalProducts, icon: <Package className="w-6 h-6 text-white" />, gradient: 'from-indigo-500 to-indigo-700' },
    { title: 'Total Suppliers', value: stats.totalSuppliers, icon: <Users className="w-6 h-6 text-white" />, gradient: 'from-violet-500 to-purple-700' },
    { title: 'Total Stock', value: stats.totalStock, icon: <Boxes className="w-6 h-6 text-white" />, gradient: 'from-emerald-500 to-emerald-700' },
    { title: 'Low Stock Alerts', value: stats.lowStockCount, icon: <AlertTriangle className="w-6 h-6 text-white" />, gradient: 'from-amber-500 to-orange-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <p className="p-10 text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 mt-1">Here's an overview of your inventory today.</p>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full mt-3"></div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <Link
            to="/products/add"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <Link
            to="/suppliers/add"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-lg border border-slate-300 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-br ${c.gradient} p-5`}>
                <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  {c.icon}
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-500 text-sm">{c.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{c.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Widget + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Low Stock Products</h3>
              <Link to="/reports" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            {stats.lowStockProducts.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.lowStockProducts.map((p) => (
                  <div key={p._id} className="px-6 py-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{p.name}</span>
                    <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {p.quantity} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-6 text-slate-500 text-sm">All products are well-stocked 🎉</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Recent Activity</h3>
              <Link to="/inventory" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            {stats.recentActivity.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recentActivity.map((log) => (
                  <div key={log._id} className="px-6 py-3 flex items-center gap-3">
                    {log.changeType === 'increase' ? (
                      <ArrowUpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span className="text-sm text-slate-700">
                      <span className="font-medium">{log.productName}</span>{' '}
                      {log.changeType === 'increase' ? '+' : '-'}{log.changeAmount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-6 text-slate-500 text-sm">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;