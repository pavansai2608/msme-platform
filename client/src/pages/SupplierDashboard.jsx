import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SupplierDashboard() {
  const [demand, setDemand] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quote, setQuote] = useState({ productType: '', quantityKg: '', pricePerKg: '', cluster: '', state: '' });
  const [message, setMessage] = useState('');
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDemand();
    fetchOrders();
  }, []);

  const fetchDemand = async () => {
    try {
      const res = await API.get('/supplier/demand');
      setDemand(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get('/supplier/orders');
      setOrders(res.data);
    } catch (err) { console.log(err); }
  };

  const handleQuote = async (e) => {
    e.preventDefault();
    try {
      await API.post('/supplier/quote', quote);
      setMessage('Quote submitted successfully');
      setQuote({ productType: '', quantityKg: '', pricePerKg: '', cluster: '', state: '' });
      fetchOrders();
    } catch (err) {
      setMessage('Error submitting quote');
    }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const chartData = demand.slice(0, 8).map(d => ({
    name: `${d._id.productType || 'N/A'} - ${d._id.cluster || 'N/A'}`,
    demand: d.totalDemand,
    msmes: d.count
  }));

  return (
    <div>
      <nav className="navbar" style={{ background: 'linear-gradient(90deg, #065f46, #059669)' }}>
        <div className="navbar-brand">India MSME Platform</div>
        <div className="navbar-nav">
          <span className="nav-link">Welcome, {name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-primary" style={{ fontSize: '2rem', marginBottom: 0, color: '#065f46' }}>Supplier Dashboard</h2>
          <span className="badge badge-success">Verified Supplier</span>
        </div>

        {/* Demand Chart */}
        <div className="dashboard-card animate-fade-in delay-1" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: 0, color: '#065f46' }}>Aggregated MSME Demand by Cluster</h4>
          </div>
          {chartData.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="demand" fill="#10b981" radius={[4, 4, 0, 0]} name="Total Demand (Kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No demand data yet. MSMEs need to submit their data first.
            </div>
          )}
        </div>

        <div className="grid-2">
          {/* Submit Quote */}
          <div className="dashboard-card animate-fade-in delay-2">
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#065f46' }}>Submit Price Quote</h4>
            {message && (
              <div style={{ background: message.includes('Error') ? '#fef2f2' : '#f0fdf4', color: message.includes('Error') ? '#b91c1c' : '#15803d', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {message}
              </div>
            )}
            <form onSubmit={handleQuote}>
              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Product Type</label>
                  <input type="text" className="form-input" value={quote.productType} onChange={e => setQuote({ ...quote, productType: e.target.value })} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Quantity (Kg)</label>
                  <input type="number" className="form-input" value={quote.quantityKg} onChange={e => setQuote({ ...quote, quantityKg: e.target.value })} required />
                </div>
              </div>
              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Price per Kg (INR)</label>
                  <input type="number" className="form-input" value={quote.pricePerKg} onChange={e => setQuote({ ...quote, pricePerKg: e.target.value })} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Cluster Location</label>
                  <input type="text" className="form-input" value={quote.cluster} onChange={e => setQuote({ ...quote, cluster: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none' }}>
                Submit Bulk Quote
              </button>
            </form>
          </div>

          {/* My Orders */}
          <div className="dashboard-card animate-fade-in delay-3">
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#065f46' }}>My Orders & Quotes</h4>
            {orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order, i) => (
                  <div key={i} style={{ background: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: '#065f46' }}>{order.productType}</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#15803d' }}>
                        Qty: {order.quantityKg} Kg • Price: ₹{order.pricePerKg}/Kg
                      </p>
                    </div>
                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'accepted' ? 'badge-info' : 'badge-warning'}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No quotes or orders yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
