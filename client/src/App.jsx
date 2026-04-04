import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MSMEDashboard from './pages/MSMEDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/msme-dashboard" element={
          <PrivateRoute role="msme"><MSMEDashboard /></PrivateRoute>
        } />
        <Route path="/supplier-dashboard" element={
          <PrivateRoute role="supplier"><SupplierDashboard /></PrivateRoute>
        } />
        <Route path="/admin-dashboard" element={
          <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
