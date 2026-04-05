import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      if (res.data.role === 'msme') navigate('/msme-dashboard');
      else if (res.data.role === 'supplier') navigate('/supplier-dashboard');
      else if (res.data.role === 'admin') navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', margin: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#2b6cb0', margin: '0 0 8px 0', fontSize: '24px' }}>
          India MSME Platform
        </h2>
        <p style={{ textAlign: 'center', color: '#666', margin: '0 0 24px 0', fontSize: '14px' }}>
          Empowering Indian Textile Businesses with AI
        </p>

        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Email</label>
            <input 
              type="email" 
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Password</label>
            <input 
              type="password" 
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2b6cb0', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
