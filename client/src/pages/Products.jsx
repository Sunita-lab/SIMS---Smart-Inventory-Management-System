import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Products</h2>
          <Link to="/products/add">
            <button>+ Add Product</button>
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ margin: '16px 0', padding: '8px', width: '300px' }}
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <Link to={`/products/edit/${p._id}`}>Edit</Link>{' '}
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                    <button onClick={() => handleAdjustStock(p)}>Adjust Stock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Products;