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
      setMessage('✅ Quote submitted successfully!');
      setQuote({ productType: '', quantityKg: '', pricePerKg: '', cluster: '', state: '' });
      fetchOrders();
    } catch (err) {
      setMessage('❌ Error submitting quote');
    }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const chartData = demand.slice(0, 8).map(d => ({
    name: `${d._id.productType || 'N/A'} - ${d._id.cluster || 'N/A'}`,
    demand: d.totalDemand,
    msmes: d.count
  }));

  const totalDemandEntries = demand.reduce((sum, d) => sum + (d.count || 0), 0);

  const cardStyle = { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#276749', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>India MSME Platform</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>Welcome, {name}</span>
          <button onClick={logout} style={{ background: '#fff', color: '#276749', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#1a365d', margin: '0 0 8px 0', fontSize: '28px' }}>Supplier Dashboard</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>See what Indian textile MSMEs need and submit your supply quotes</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>Total Demand Entries</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{totalDemandEntries} MSME data entries</p>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
            <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>My Active Quotes</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{orders.length} quotes I submitted</p>
          </div>
        </div>

        {/* Demand Chart */}
        <div style={cardStyle}>
          <h4 style={{ color: '#276749', margin: '0 0 16px', fontSize: '18px' }}>MSME Demand Across India — by Product & Cluster</h4>
          {chartData.length > 0 ? (
            <div style={{ height: '300px', width: '100%', marginBottom: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#276749" name="Total inventory quantity demanded" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>No MSME demand data yet. MSMEs need to submit their monthly data first.</p>
          )}
          <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>This data is aggregated from all registered MSMEs on the platform. Submit a quote to supply these products.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Submit Quote */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <h4 style={{ color: '#276749', margin: '0 0 16px', fontSize: '18px' }}>Submit Supply Quote</h4>
            {message && (
              <div style={{ color: message.includes('Error') ? '#e53e3e' : '#38a169', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
                {message}
              </div>
            )}
            <form onSubmit={handleQuote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Product Type</label>
                <input type="text" value={quote.productType} onChange={e => setQuote({ ...quote, productType: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Quantity in Kg</label>
                <input type="number" value={quote.quantityKg} onChange={e => setQuote({ ...quote, quantityKg: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Price per Kg in INR</label>
                <input type="number" value={quote.pricePerKg} onChange={e => setQuote({ ...quote, pricePerKg: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Cluster</label>
                <input type="text" value={quote.cluster} onChange={e => setQuote({ ...quote, cluster: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input type="text" value={quote.state} onChange={e => setQuote({ ...quote, state: e.target.value })} style={inputStyle} required />
              </div>
              <button type="submit" style={{ background: '#276749', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' }}>
                Submit Quote
              </button>
            </form>
          </div>

          {/* My Orders */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <h4 style={{ color: '#276749', margin: '0 0 16px', fontSize: '18px' }}>My Quotes & Orders</h4>
            {orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.map((order, i) => (
                  <div key={i} style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: '#1a202c' }}>{order.productType}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#718096' }}>
                        {order.quantityKg} Kg | ₹{order.pricePerKg}/Kg
                      </p>
                    </div>
                    <span style={{ 
                      background: order.status === 'delivered' ? '#48bb78' : order.status === 'accepted' ? '#4299e1' : '#ed8936', 
                      color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' 
                    }}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
               <p style={{ color: '#666' }}>You haven't submitted any quotes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
