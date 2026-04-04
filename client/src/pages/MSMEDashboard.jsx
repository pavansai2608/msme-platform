import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MSMEDashboard() {
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState({ month: '', salesRevenue: '', inventoryQty: '', rawMaterialCost: '', productType: '' });
  const [message, setMessage] = useState('');
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForecast();
    fetchInsights();
    fetchSchemes();
  }, []);

  const fetchForecast = async () => {
    try {
      const res = await API.get('/msme/forecast');
      setForecast(res.data.forecast || []);
    } catch (err) { console.log(err); }
  };

  const fetchInsights = async () => {
    try {
      const res = await API.post('/msme/insights', {});
      setInsights(res.data.insights || []);
    } catch (err) { console.log(err); }
  };

  const fetchSchemes = async () => {
    try {
      const res = await API.post('/msme/schemes', {
        annual_turnover: 500000,
        enterprise_size: 'Micro',
        employee_count: 10
      });
      setSchemes(res.data.eligible_schemes || []);
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/msme/data', form);
      setMessage('Data saved successfully');
      setForm({ month: '', salesRevenue: '', inventoryQty: '', rawMaterialCost: '', productType: '' });
      fetchInsights();
    } catch (err) {
      setMessage('Error saving data');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <div style={{ background: '#2b6cb0', padding: '16px 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>India MSME Platform</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#fff' }}>Welcome, {name}</span>
          <button onClick={logout}
            style={{ background: '#fff', color: '#2b6cb0', border: 'none',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h3 style={{ color: '#1a365d', marginBottom: '24px' }}>MSME Owner Dashboard</h3>

        {/* Forecast Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <h4 style={{ color: '#2b6cb0', marginBottom: '16px' }}>Textile Demand Forecast — Next 3 Months</h4>
          {forecast.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ds" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="yhat" stroke="#2b6cb0" strokeWidth={2} name="Forecast" />
                <Line type="monotone" dataKey="yhat_upper" stroke="#48bb78" strokeWidth={1} strokeDasharray="5 5" name="Upper" />
                <Line type="monotone" dataKey="yhat_lower" stroke="#fc8181" strokeWidth={1} strokeDasharray="5 5" name="Lower" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#666', textAlign: 'center' }}>Loading forecast...</p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* AI Insights */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ color: '#2b6cb0', marginBottom: '16px' }}>AI Business Insights</h4>
            {insights.length > 0 ? insights.map((insight, i) => (
              <div key={i} style={{ background: '#ebf8ff', padding: '12px', borderRadius: '8px',
                marginBottom: '12px', borderLeft: '4px solid #2b6cb0' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#1a365d' }}>{insight}</p>
              </div>
            )) : <p style={{ color: '#666' }}>Loading insights...</p>}
          </div>

          {/* Government Schemes */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ color: '#2b6cb0', marginBottom: '16px' }}>Eligible Government Schemes</h4>
            {schemes.length > 0 ? schemes.map((scheme, i) => (
              <div key={i} style={{ background: '#f0fff4', padding: '12px', borderRadius: '8px',
                marginBottom: '12px', borderLeft: '4px solid #48bb78' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#276749' }}>{scheme.name}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>{scheme.benefit}</p>
              </div>
            )) : <p style={{ color: '#666' }}>Loading schemes...</p>}
          </div>
        </div>

        {/* Data Entry Form */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h4 style={{ color: '#2b6cb0', marginBottom: '16px' }}>Enter Monthly Business Data</h4>
          {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              ['Month (e.g. 2024-10)', 'month', 'text'],
              ['Sales Revenue (INR)', 'salesRevenue', 'number'],
              ['Inventory Quantity', 'inventoryQty', 'number'],
              ['Raw Material Cost (INR)', 'rawMaterialCost', 'number'],
              ['Product Type', 'productType', 'text']
            ].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>{label}</label>
                <input type={type} value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px',
                    border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit"
                style={{ background: '#2b6cb0', color: '#fff', border: 'none',
                  padding: '12px 32px', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: '600', fontSize: '14px' }}>
                Save Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
