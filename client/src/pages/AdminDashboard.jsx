import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#2b6cb0', '#276749', '#dd6b20', '#6b46c1', '#c53030', '#285e61'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const stateData = (stats.stateBreakdown || []).map(s => ({
    name: s._id || 'Unknown',
    value: s.count
  }));

  const clusterData = (stats.clusterBreakdown || []).map(c => ({
    name: c._id || 'Unknown',
    count: c.count
  }));

  const cardStyle = { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#6b46c1', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>India MSME Platform — Admin Panel</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>Welcome, {name}</span>
          <button onClick={logout} style={{ background: '#fff', color: '#6b46c1', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#1a365d', margin: '0 0 8px 0', fontSize: '28px' }}>Admin Dashboard</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>Platform-wide analytics and user management</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
          {[
            { label: 'Total MSMEs Registered', value: stats.totalMSMEs || 0, color: '#2b6cb0', icon: '🏭' },
            { label: 'Total Suppliers Registered', value: stats.totalSuppliers || 0, color: '#276749', icon: '🚚' },
            { label: 'Total Data Entries', value: stats.totalDataPoints || 0, color: '#ed8936', icon: '📊' }
          ].map((card, i) => (
            <div key={i} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', fontWeight: '500' }}>{card.label}</p>
              <h2 style={{ margin: '8px 0 0', color: card.color, fontSize: '36px' }}>{card.value}</h2>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* State Breakdown Pie */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <h4 style={{ color: '#6b46c1', margin: '0 0 16px', fontSize: '18px' }}>MSME Distribution by State</h4>
            {stateData.length > 0 ? (
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stateData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {stateData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>No state data yet</p>}
          </div>

          {/* Cluster Breakdown Bar */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <h4 style={{ color: '#6b46c1', margin: '0 0 16px', fontSize: '18px' }}>MSMEs by Textile Cluster</h4>
            {clusterData.length > 0 ? (
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clusterData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6b46c1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>No cluster data yet</p>}
          </div>
        </div>

        {/* Users Table */}
        <div style={cardStyle}>
          <h4 style={{ color: '#6b46c1', margin: '0 0 16px', fontSize: '18px' }}>All Registered Users</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Name', 'Email', 'Role', 'State', 'Cluster', 'Enterprise Size'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: '#4a5568', fontWeight: 'bold' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((user, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1a202c' }}>{user.name}</td>
                    <td style={{ padding: '12px 16px', color: '#4a5568' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        background: user.role === 'admin' ? '#6b46c1' : user.role === 'supplier' ? '#276749' : '#2b6cb0', 
                        color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' 
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4a5568' }}>{user.state || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#4a5568' }}>{user.cluster || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#4a5568' }}>{user.enterpriseSize || '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px 0', textAlign: 'center', color: '#666' }}>
                      No users registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
