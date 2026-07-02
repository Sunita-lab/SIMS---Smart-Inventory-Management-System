import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalStock: 0,
    lowStockCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Suppliers" value={stats.totalSuppliers} />
        <StatCard title="Total Stock" value={stats.totalStock} />
        <StatCard title="Low Stock Alerts" value={stats.lowStockCount} highlight={stats.lowStockCount > 0} />
      </div>
    </div>
  );
}

function StatCard({ title, value, highlight }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: highlight ? '#fff3cd' : '#fff',
      }}
    >
      <p style={{ color: '#666', fontSize: '14px' }}>{title}</p>
      <h3 style={{ fontSize: '28px', margin: '8px 0 0' }}>{value}</h3>
    </div>
  );
}

export default Dashboard;