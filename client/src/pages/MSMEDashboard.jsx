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
      setMessage('Error saving data: ' + (err.response?.data?.message || err.message));
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">India MSME Platform</div>
        <div className="navbar-nav">
          <span className="nav-link">Welcome, {name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-primary" style={{ fontSize: '2rem', marginBottom: 0 }}>MSME Owner Dashboard</h2>
          <span className="badge badge-info">Active Plan</span>
        </div>

        {/* Forecast Chart */}
        <div className="dashboard-card animate-fade-in delay-1" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Textile Demand Forecast (Prophet AI)</h4>
            <span className="badge badge-success">Live Forecast</span>
          </div>
          
          {forecast.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="ds" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="yhat" stroke="var(--color-primary)" strokeWidth={3} dot={{r: 4, fill: "var(--color-primary)", strokeWidth: 2}} activeDot={{r: 6}} name="Expected Demand" />
                  <Line type="monotone" dataKey="yhat_upper" stroke="var(--color-accent)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Upper Bound" />
                  <Line type="monotone" dataKey="yhat_lower" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Lower Bound" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading forecast from AI Service...
            </div>
          )}
        </div>

        <div className="grid-2">
          {/* AI Insights */}
          <div className="dashboard-card animate-fade-in delay-2">
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>AI Business Insights</h4>
            {insights.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {insights.map((insight, i) => (
                  <div key={i} style={{ background: '#f0f9ff', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-secondary)' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#0369a1', lineHeight: '1.5' }}>{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading intelligent insights...</div>
            )}
          </div>

          {/* Government Schemes */}
          <div className="dashboard-card animate-fade-in delay-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Eligible Government Schemes</h4>
              <span className="badge badge-warning">{schemes.length} Available</span>
            </div>
            
            {schemes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {schemes.map((scheme, i) => (
                  <div key={i} style={{ background: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-accent)' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: '#166534' }}>{scheme.name}</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#15803d' }}>{scheme.benefit}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Discovering government schemes...</div>
            )}
          </div>
        </div>

        {/* Data Entry Form */}
        <div className="dashboard-card animate-fade-in delay-3">
          <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Update Monthly Data</h4>
          
          {message && (
            <div style={{ background: message.includes('Error') ? '#fef2f2' : '#f0fdf4', color: message.includes('Error') ? '#b91c1c' : '#15803d', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-3">
              {[
                ['Month (YYYY-MM)', 'month', 'text'],
                ['Sales (INR)', 'salesRevenue', 'number'],
                ['Inventory Qty', 'inventoryQty', 'number'],
                ['Material Cost', 'rawMaterialCost', 'number'],
                ['Product Type', 'productType', 'text']
              ].map(([label, key, type]) => (
                <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{label}</label>
                  <input type={type} className="form-input" value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    required={key === 'month' || key === 'salesRevenue'} />
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                  Update Data & Refine AI
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
