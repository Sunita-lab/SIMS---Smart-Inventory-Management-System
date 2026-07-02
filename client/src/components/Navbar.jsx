import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/inventory', label: 'Inventory' },
    { path: '/reports', label: 'Reports' },
  ];

  return (
    <nav className="bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">SIMS</h1>
          <p className="text-slate-400 text-xs">Smart Inventory Management System</p>
        </div>

        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-indigo-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;