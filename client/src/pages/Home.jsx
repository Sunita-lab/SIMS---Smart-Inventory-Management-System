import { Link } from 'react-router-dom';
import { Package, Users, TrendingUp, BarChart3, ShieldCheck, Zap } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      title: 'Secure Login',
      desc: 'Authentication and protected routes for all users.',
    },
    {
      icon: <Package className="w-6 h-6 text-indigo-400" />,
      title: 'Product Management',
      desc: 'Add, edit, delete, and search products with full details.',
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Supplier Tracking',
      desc: 'Manage supplier contacts, addresses, and details.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      title: 'Inventory Tracking',
      desc: 'Log every stock change with full history.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: 'Reports & Analytics',
      desc: 'Low-stock alerts, charts, and summary insights.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Real-time Dashboard',
      desc: 'Instant, at-a-glance overview of your entire inventory.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-6">
          Inventory made simple
        </span>

        <p className="text-slate-400 text-lg mb-2">Welcome to</p>
        <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-4">
          S.I.M.S
        </h1>
        <p className="text-indigo-300 text-xl font-medium mb-8">
          Smart Inventory Management System
        </p>
        <p className="text-slate-400 max-w-xl mb-10 leading-relaxed">
          Manage products, suppliers, stock, and reports — all from a single,
          beautifully simple dashboard.
        </p>

        <div className="flex gap-4">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg border border-white/20 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center">
        <p className="text-slate-500 text-sm">
          Built with the MERN Stack · SIMS © 2026
        </p>
      </footer>
    </div>
  );
}

export default Home;