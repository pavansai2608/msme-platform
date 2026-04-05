import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const states = ['Gujarat', 'Tamil Nadu', 'Punjab', 'Maharashtra', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'];
const clusters = ['Surat', 'Tiruppur', 'Ludhiana', 'Bhiwandi', 'Panipat', 'Coimbatore', 'Erode', 'Ichalkaranji'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'msme',
    udyamId: '', gstin: '', state: 'Gujarat', cluster: 'Surat',
    enterpriseSize: 'Micro', annualTurnover: '', employeeCount: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '100%', maxWidth: '700px' }}>
        <h2 style={{ textAlign: 'center', color: '#2b6cb0', margin: '0 0 24px 0', fontSize: '24px' }}>
          Create an Account
        </h2>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Register As</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle} required>
              <option value="msme">MSME Owner</option>
              <option value="supplier">Supplier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {form.role === 'msme' && (
            <>
              <div>
                <label style={labelStyle}>Udyam ID</label>
                <input type="text" placeholder="e.g. UDYAM-GJ-01-0012345" value={form.udyamId} onChange={e => setForm({ ...form, udyamId: e.target.value })} style={inputStyle} />
                <span style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>Find your Udyam ID at udyamregistration.gov.in</span>
              </div>
              <div>
                <label style={labelStyle}>GSTIN</label>
                <input type="text" placeholder="e.g. 24AAAAA0000A1Z5" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} style={inputStyle} />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>State</label>
            <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={inputStyle} required>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Cluster</label>
            <select value={form.cluster} onChange={e => setForm({ ...form, cluster: e.target.value })} style={inputStyle} required>
              {clusters.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Enterprise Size</label>
            <select value={form.enterpriseSize} onChange={e => setForm({ ...form, enterpriseSize: e.target.value })} style={inputStyle} required>
              <option value="Micro">Micro</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Annual Turnover (INR)</label>
            <input type="number" value={form.annualTurnover} onChange={e => setForm({ ...form, annualTurnover: e.target.value })} style={inputStyle} required />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Employee Count</label>
            <input type="number" value={form.employeeCount} onChange={e => setForm({ ...form, employeeCount: e.target.value })} style={inputStyle} required />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Register
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#2b6cb0', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
