import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const states = ['Gujarat', 'Tamil Nadu', 'Punjab', 'Maharashtra', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'];
const clusters = ['Surat', 'Tiruppur', 'Ludhiana', 'Bhiwandi', 'Panipat', 'Coimbatore', 'Erode', 'Ichalkaranji'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'msme',
    udyamId: '', gstin: '', state: '', cluster: '',
    sector: 'Textile', enterpriseSize: 'Micro',
    annualTurnover: '', employeeCount: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const input = (label, key, type = 'text') => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '13px' }}>
        {label}
      </label>
      <input type={type} value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ width: '100%', padding: '8px', borderRadius: '6px',
          border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }} />
    </div>
  );

  const select = (label, key, options) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '13px' }}>
        {label}
      </label>
      <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ width: '100%', padding: '8px', borderRadius: '6px',
          border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '40px 20px' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#1a365d', marginBottom: '24px' }}>
          Register on India MSME Platform
        </h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {input('Full Name', 'name')}
          {input('Email', 'email', 'email')}
          {input('Password', 'password', 'password')}
          {select('Register As', 'role', ['msme', 'supplier', 'admin'])}
          {input('Udyam ID (e.g. UDYAM-GJ-01-0012345)', 'udyamId')}
          {input('GSTIN', 'gstin')}
          {select('State', 'state', states)}
          {select('Cluster', 'cluster', clusters)}
          {select('Enterprise Size', 'enterpriseSize', ['Micro', 'Small', 'Medium'])}
          {input('Annual Turnover (INR)', 'annualTurnover', 'number')}
          {input('Employee Count', 'employeeCount', 'number')}
          <button type="submit"
            style={{ width: '100%', padding: '12px', background: '#2b6cb0',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '16px', cursor: 'pointer', fontWeight: '600', marginTop: '8px' }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#2b6cb0' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
