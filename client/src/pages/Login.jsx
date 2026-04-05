import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      if (res.data.role === 'msme') navigate('/msme-dashboard');
      else if (res.data.role === 'supplier') navigate('/supplier-dashboard');
      else if (res.data.role === 'admin') navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-primary heading-gradient">India MSME Platform</h2>
          <p className="text-sub">Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group delay-1 animate-fade-in">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required 
            />
          </div>

          <div className="form-group delay-2 animate-fade-in">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required 
            />
          </div>

          <div className="form-group delay-3 animate-fade-in" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-sub" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
