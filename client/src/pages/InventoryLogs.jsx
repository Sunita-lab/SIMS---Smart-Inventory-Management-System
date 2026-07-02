import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function InventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/inventory/logs');
        setLogs(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Inventory Logs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Change</th>
                <th>Amount</th>
                <th>Previous Qty</th>
                <th>New Qty</th>
                <th>Updated By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.productName}</td>
                  <td style={{ color: log.changeType === 'increase' ? 'green' : 'red' }}>
                    {log.changeType === 'increase' ? '▲ Increase' : '▼ Decrease'}
                  </td>
                  <td>{log.changeAmount}</td>
                  <td>{log.previousQuantity}</td>
                  <td>{log.newQuantity}</td>
                  <td>{log.updatedByName}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InventoryLogs;