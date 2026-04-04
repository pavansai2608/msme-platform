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
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#276749', padding: '16px 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>India MSME Platform</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#fff' }}>Welcome, {name}</span>
          <button onClick={logout}
            style={{ background: '#fff', color: '#276749', border: 'none',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h3 style={{ color: '#1a365d', marginBottom: '24px' }}>Supplier Dashboard</h3>

        {/* Demand Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <h4 style={{ color: '#276749', marginBottom: '16px' }}>Aggregated MSME Demand by Cluster</h4>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#276749" name="Total Demand" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#666', textAlign: 'center' }}>No demand data yet. MSMEs need to submit their data first.</p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Submit Quote */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ color: '#276749', marginBottom: '16px' }}>Submit Price Quote</h4>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            <form onSubmit={handleQuote}>
              {[
                ['Product Type', 'productType', 'text'],
                ['Quantity (Kg)', 'quantityKg', 'number'],
                ['Price per Kg (INR)', 'pricePerKg', 'number'],
                ['Cluster', 'cluster', 'text'],
                ['State', 'state', 'text']
              ].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>{label}</label>
                  <input type={type} value={quote[key]}
                    onChange={e => setQuote({ ...quote, [key]: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px',
                      border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              ))}
              <button type="submit"
                style={{ background: '#276749', color: '#fff', border: 'none',
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Submit Quote
              </button>
            </form>
          </div>

          {/* My Orders */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ color: '#276749', marginBottom: '16px' }}>My Orders</h4>
            {orders.length > 0 ? orders.map((order, i) => (
              <div key={i} style={{ background: '#f0fff4', padding: '12px', borderRadius: '8px',
                marginBottom: '12px', borderLeft: '4px solid #276749' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{order.productType}</p>
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                  Qty: {order.quantityKg} Kg | Price: ₹{order.pricePerKg}/Kg
                </p>
                <span style={{ background: order.status === 'delivered' ? '#276749' :
                  order.status === 'accepted' ? '#2b6cb0' : '#dd6b20',
                  color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  {order.status}
                </span>
              </div>
            )) : <p style={{ color: '#666' }}>No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
