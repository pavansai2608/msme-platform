import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

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

  return (
    <div>
      <nav className="navbar" style={{ background: 'linear-gradient(90deg, #4c1d95, #6d28d9)' }}>
        <div className="navbar-brand">India MSME Platform</div>
        <div className="navbar-nav">
          <span className="nav-link">Welcome, {name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-primary" style={{ fontSize: '2rem', marginBottom: 0, color: '#4c1d95' }}>Platform Administration</h2>
          <span className="badge badge-warning" style={{ background: '#f3e8ff', color: '#6d28d9' }}>System Admin</span>
        </div>

        {/* Stats Cards */}
        <div className="grid-3">
          {[
            { label: 'Total MSMEs', value: stats.totalMSMEs || 0, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Total Suppliers', value: stats.totalSuppliers || 0, color: '#10b981', bg: '#ecfdf5' },
            { label: 'Data Entries', value: stats.totalDataPoints || 0, color: '#f59e0b', bg: '#fffbeb' }
          ].map((card, i) => (
            <div key={i} className={`dashboard-card animate-fade-in delay-${i+1}`} style={{ borderTop: `4px solid ${card.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
              <h2 style={{ margin: '0.5rem 0 0', color: card.color, fontSize: '3rem', fontFamily: 'var(--font-heading)' }}>{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* State Breakdown Pie */}
          <div className="dashboard-card animate-fade-in delay-2">
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#4c1d95' }}>MSMEs by State</h4>
            {stateData.length > 0 ? (
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stateData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} label>
                      {stateData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No state data available</div>}
          </div>

          {/* Cluster Breakdown Bar */}
          <div className="dashboard-card animate-fade-in delay-2">
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#4c1d95' }}>MSMEs by Cluster</h4>
            {clusterData.length > 0 ? (
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clusterData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="MSME Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No cluster data available</div>}
          </div>
        </div>

        {/* Users Table */}
        <div className="dashboard-card animate-fade-in delay-3" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
            <h4 className="heading-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#4c1d95' }}>All Registered Users</h4>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #cbd5e1' }}>
                  {['Name', 'Email', 'Role', 'State', 'Cluster', 'Enterprise Size'].map(h => (
                    <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((user, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500', color: '#0f172a' }}>{user.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{user.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${user.role === 'admin' ? 'badge-warning' : user.role === 'supplier' ? 'badge-success' : 'badge-info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>{user.state || '-'}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>{user.cluster || '-'}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>{user.enterpriseSize || '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
