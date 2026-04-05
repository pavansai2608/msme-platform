import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const states = ['Gujarat', 'Tamil Nadu', 'Punjab', 'Maharashtra', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'];
const clusters = ['Surat', 'Tiruppur', 'Ludhiana', 'Bhiwandi', 'Panipat', 'Coimbatore', 'Erode', 'Ichalkaranji'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'msme',
    udyamId: '', gstin: '', state: 'Gujarat', cluster: 'Surat',
    sector: 'Textile', enterpriseSize: 'Micro',
    annualTurnover: '', employeeCount: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const input = (label, key, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input 
        type={type} 
        className="form-input"
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        required
      />
    </div>
  );

  const select = (label, key, options) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select 
        className="form-input"
        value={form[key]} 
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        required
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="auth-wrapper" style={{ padding: '2rem 1rem' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-primary heading-gradient" style={{ fontSize: '2rem' }}>Join the Platform</h2>
          <p className="text-sub">Register your MSME or Supplier account</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="delay-1 animate-fade-in">
          
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>Account Details</h3>
          <div className="grid-2">
            {input('Full Name', 'name')}
            {input('Email Address', 'email', 'email')}
          </div>
          <div className="grid-2">
            {input('Password', 'password', 'password')}
            {select('Register As', 'role', ['msme', 'supplier', 'admin'])}
          </div>

          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '1rem', fontSize: '1.1rem' }}>Business Profile</h3>
          <div className="grid-2">
            {input('Udyam ID', 'udyamId')}
            {input('GSTIN', 'gstin')}
          </div>
          <div className="grid-2">
            {select('State', 'state', states)}
            {select('Cluster', 'cluster', clusters)}
          </div>
          <div className="grid-3">
            {select('Enterprise Size', 'enterpriseSize', ['Micro', 'Small', 'Medium'])}
            {input('Turnover (INR)', 'annualTurnover', 'number')}
            {input('Employees', 'employeeCount', 'number')}
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-sub" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
}
