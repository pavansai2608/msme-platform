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
      setMessage('✅ Data saved! Your forecasts will be updated.');
      setForm({ month: '', salesRevenue: '', inventoryQty: '', rawMaterialCost: '', productType: '' });
      fetchInsights();
    } catch (err) {
      setMessage('❌ Error saving data: ' + (err.response?.data?.message || err.message));
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getEmojiForInsight = (text) => {
    const t = text.toLowerCase();
    if (t.includes('sale') || t.includes('revenue') || t.includes('cost')) return '💰';
    if (t.includes('scheme') || t.includes('loan')) return '🏛️';
    return '📦';
  };

  const cardStyle = { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: '#2b6cb0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>India MSME Platform</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>Welcome, {name}</span>
          <button onClick={logout} style={{ background: '#fff', color: '#2b6cb0', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#1a365d', margin: '0 0 8px 0', fontSize: '28px' }}>MSME Owner Dashboard</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>Your AI-powered business intelligence center</p>
        </div>

        {/* 3 Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
            <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>Demand Forecast</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Next 3 months forecast available</p>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💡</div>
            <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>AI Insights</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{insights.length} business tips ready</p>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏛️</div>
            <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>Govt Schemes</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{schemes.length} schemes you qualify for</p>
          </div>
        </div>

        {/* Forecast Chart */}
        <div style={cardStyle}>
          <h4 style={{ color: '#1a365d', margin: '0 0 16px', fontSize: '18px' }}>Textile Demand Forecast — Next 3 Months</h4>
          {forecast.length > 0 ? (
            <div style={{ height: '300px', width: '100%', marginBottom: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ds" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="yhat" stroke="#2b6cb0" strokeWidth={3} name="Predicted demand" />
                  <Line type="monotone" dataKey="yhat_upper" stroke="#48bb78" strokeWidth={2} strokeDasharray="5 5" name="Upper estimate" />
                  <Line type="monotone" dataKey="yhat_lower" stroke="#e53e3e" strokeWidth={2} strokeDasharray="5 5" name="Lower estimate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>Loading forecast data...</p>
          )}
          <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>This forecast is generated by our AI model trained on 8 years of Indian textile production data from MOSPI</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* AI Insights */}
          <div style={cardStyle}>
            <h4 style={{ color: '#1a365d', margin: '0 0 16px', fontSize: '18px' }}>AI Business Recommendations</h4>
            {insights.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {insights.map((insight, i) => (
                  <div key={i} style={{ background: '#ebf8ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #2b6cb0' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#1a365d', lineHeight: '1.5' }}>
                      {getEmojiForInsight(insight)} {insight}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>Loading intelligent insights...</p>
            )}
          </div>

          {/* Government Schemes */}
          <div style={cardStyle}>
            <h4 style={{ color: '#1a365d', margin: '0 0 16px', fontSize: '18px' }}>Schemes You Qualify For</h4>
            {schemes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {schemes.map((scheme, i) => (
                  <div key={i} style={{ background: '#f0fff4', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#1a202c' }}>{scheme.name}</p>
                    <p style={{ margin: '4px 0 12px', fontSize: '13px', color: '#718096' }}>{scheme.benefit}</p>
                    <button onClick={() => alert('Coming soon')} style={{ background: '#48bb78', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>Discovering government schemes...</p>
            )}
          </div>
        </div>

        {/* Data Entry Form */}
        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#1a365d', margin: '0 0 8px', fontSize: '18px' }}>Enter Your Monthly Business Data</h4>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Enter your data every month to get updated AI forecasts and insights</p>
          </div>
          
          {message && (
             <div style={{ color: message.includes('Error') ? '#e53e3e' : '#38a169', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                ['Month', 'month', 'text', '2024-10'],
                ['Sales Revenue in INR', 'salesRevenue', 'number', ''],
                ['Inventory Quantity', 'inventoryQty', 'number', ''],
                ['Raw Material Cost in INR', 'rawMaterialCost', 'number', ''],
                ['Product Type', 'productType', 'text', 'e.g. Saree']
              ].map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={inputStyle}
                    required={key === 'month' || key === 'salesRevenue'} />
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: 'span 2' }}>
                <button type="submit" style={{ background: '#2b6cb0', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                  Save My Data
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
