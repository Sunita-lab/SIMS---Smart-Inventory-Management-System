import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    lowStockThreshold: 10,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      API.get(`/products/${id}`).then((res) => setFormData(res.data));
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /><br />
        <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} required /><br />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} /><br />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required /><br />
        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required /><br />
        <input name="lowStockThreshold" type="number" placeholder="Low Stock Threshold" value={formData.lowStockThreshold} onChange={handleChange} /><br />
        <button type="submit">{isEdit ? 'Update' : 'Add'} Product</button>
      </form>
    </div>
  );
}

export default ProductForm;