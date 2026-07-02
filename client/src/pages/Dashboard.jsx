import { useState, useEffect } from 'react';
import { Package, Users, Boxes, AlertTriangle } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalStock: 0,
    lowStockCount: 0,
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
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="w-6 h-6 text-white" />,
      gradient: 'from-indigo-500 to-indigo-700',
    },
    {
      title: 'Total Suppliers',
      value: stats.totalSuppliers,
      icon: <Users className="w-6 h-6 text-white" />,
      gradient: 'from-violet-500 to-purple-700',
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: <Boxes className="w-6 h-6 text-white" />,
      gradient: 'from-emerald-500 to-emerald-700',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount,
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        Dashboard
       </h2>
       <p className="text-slate-500 mt-1">
       Here's an overview of your inventory today.
      </p>
      <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full mt-3"></div>
      </div>
        {loading ? (
          <p className="text-slate-500">Loading dashboard...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
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
        )}
      </div>
    </div>
  );
}

export default Dashboard;