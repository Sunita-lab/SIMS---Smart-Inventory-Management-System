import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Suppliers from './pages/Suppliers';
import SupplierForm from './pages/SupplierForm';
import InventoryLogs from './pages/InventoryLogs';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/products/add" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
        <Route path="/suppliers/add" element={<ProtectedRoute><SupplierForm /></ProtectedRoute>} />
        <Route path="/suppliers/edit/:id" element={<ProtectedRoute><SupplierForm /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><InventoryLogs /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;