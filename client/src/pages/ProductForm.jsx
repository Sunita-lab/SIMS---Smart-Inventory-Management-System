import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    lowStockThreshold: 10,
    supplier: '',
  });
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    API.get('/suppliers').then((res) => setSuppliers(res.data));
  }, []);

  useEffect(() => {
    if (isEdit) {
      API.get(`/products/${id}`).then((res) => {
        const data = res.data;
        setFormData({
          ...data,
          supplier: data.supplier?._id || data.supplier || '',
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/products/${id}`, formData);
      } else {
        await API.post('/products', formData);
      }
      navigate('/products');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/products" className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className={inputClass} />
            <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} required className={inputClass} />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className={inputClass} />
            <div className="grid grid-cols-2 gap-4">
              <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required className={inputClass} />
              <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required className={inputClass} />
            </div>
            <input name="lowStockThreshold" type="number" placeholder="Low Stock Threshold" value={formData.lowStockThreshold} onChange={handleChange} className={inputClass} />

            <select
              name="supplier"
              value={formData.supplier || ''}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Supplier (optional)</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {isEdit ? 'Update' : 'Add'} Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;