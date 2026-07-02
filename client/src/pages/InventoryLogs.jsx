import { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory Logs</h2>
          <p className="text-slate-500 mt-1">Full history of stock changes.</p>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full mt-3"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="p-6 text-slate-500">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="p-6 text-slate-500">No inventory changes yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Product</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Change</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Amount</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Previous</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">New</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Updated By</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{log.productName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${
                          log.changeType === 'increase'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {log.changeType === 'increase' ? (
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownCircle className="w-3.5 h-3.5" />
                        )}
                        {log.changeType === 'increase' ? 'Increase' : 'Decrease'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{log.changeAmount}</td>
                    <td className="px-6 py-4 text-slate-600">{log.previousQuantity}</td>
                    <td className="px-6 py-4 text-slate-600">{log.newQuantity}</td>
                    <td className="px-6 py-4 text-slate-600">{log.updatedByName}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(log.createdAt).toLocaleString()}
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

export default InventoryLogs;