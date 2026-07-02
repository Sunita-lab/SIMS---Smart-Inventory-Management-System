import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /><br />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} /><br />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} /><br />
          <button type="submit">{isEdit ? 'Update' : 'Add'} Supplier</button>
        </form>
      </div>
    </div>
  );
}

export default SupplierForm;