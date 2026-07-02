import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/suppliers${search ? `?search=${search}` : ''}`);
      setSuppliers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await API.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Suppliers</h2>
            <p className="text-slate-500 mt-1">Manage your supplier contacts.</p>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full mt-3"></div>
          </div>
          <Link
            to="/suppliers/add"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </Link>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="p-6 text-slate-500">Loading...</p>
          ) : suppliers.length === 0 ? (
            <p className="p-6 text-slate-500">No suppliers found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Email</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Phone</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Address</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                    <td className="px-6 py-4 text-slate-600">{s.email}</td>
                    <td className="px-6 py-4 text-slate-600">{s.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{s.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/suppliers/edit/${s._id}`} className="text-indigo-600 hover:text-indigo-800">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
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

export default Suppliers;