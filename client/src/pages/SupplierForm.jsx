import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function SupplierForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      API.get(`/suppliers/${id}`).then((res) => setFormData(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/suppliers/${id}`, formData);
      } else {
        await API.post('/suppliers', formData);
      }
      navigate('/suppliers');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error saving supplier');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/suppliers" className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Suppliers
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {isEdit ? 'Edit Supplier' : 'Add Supplier'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className={inputClass} />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={inputClass} />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className={inputClass} />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className={inputClass} />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {isEdit ? 'Update' : 'Add'} Supplier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SupplierForm;