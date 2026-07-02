import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, TrendingUp } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products${search ? `?search=${search}` : ''}`);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdjustStock = async (product) => {
    const changeType = window.prompt('Type "increase" or "decrease":');
    if (!['increase', 'decrease'].includes(changeType)) {
      alert('Invalid input');
      return;
    }
    const amount = window.prompt('Enter amount:');
    if (!amount || isNaN(amount)) {
      alert('Invalid amount');
      return;
    }
    try {
      await API.post('/inventory/adjust', {
        productId: product._id,
        changeType,
        amount: Number(amount),
      });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adjusting stock');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products</h2>
            <p className="text-slate-500 mt-1">Manage your product catalog.</p>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full mt-3"></div>
          </div>
          <Link
            to="/products/add"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="p-6 text-slate-500">Loading...</p>
          ) : products.length === 0 ? (
            <p className="p-6 text-slate-500">No products found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">SKU</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Category</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Price</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Quantity</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-4 text-slate-600">{p.sku}</td>
                    <td className="px-6 py-4 text-slate-600">{p.category}</td>
                    <td className="px-6 py-4 text-slate-600">₹{p.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.quantity <= p.lowStockThreshold
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {p.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/products/edit/${p._id}`} className="text-indigo-600 hover:text-indigo-800">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAdjustStock(p)} className="text-emerald-600 hover:text-emerald-800">
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;