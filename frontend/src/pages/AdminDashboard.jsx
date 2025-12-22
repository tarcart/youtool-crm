import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    // STATE
    const [stats, setStats] = useState({ totalCompanies: 0, totalUsers: 0, totalOpportunities: 0, totalPipelineValue: 0 });
    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // NEW: Control which tab is visible ('users' or 'companies')
    const [activeTab, setActiveTab] = useState('users');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // FETCH DATA
    const fetchData = async () => {
        try {
            const [statsRes, compRes, usersRes] = await Promise.all([
                axios.get('/api/admin/stats', { headers }),
                axios.get('/api/admin/companies', { headers }),
                axios.get('/api/admin/users', { headers })
            ]);
            setStats(statsRes.data);
            setCompanies(compRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            setError('Access Denied or Server Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // USER ACTIONS
    const handleToggleUserStatus = async (userId, newStatus) => {
        try {
            await axios.patch(`/api/admin/users/${userId}/status`, { isActive: newStatus }, { headers });
            setUsers(users.map(u => u.id === userId ? { ...u, isActive: newStatus, emailToken: newStatus ? null : u.emailToken } : u));
        } catch (err) { alert(err.response?.data?.error || "Failed"); }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Permanently delete this user?")) return;
        try {
            await axios.delete(`/api/admin/users/${userId}`, { headers });
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) { alert("Failed to delete"); }
    };

    // COMPANY ACTIONS
    const handleToggleCompany = async (companyId, currentStatus) => {
         try {
            const res = await axios.patch(`/api/admin/companies/${companyId}/status`, { isActive: !currentStatus }, { headers });
            setCompanies(companies.map(c => c.id === companyId ? { ...c, isActive: !currentStatus } : c));
        } catch (err) { alert(err.message); }
    };

    // HELPER: Badge Colors
    const getUserStatus = (user) => {
        if (user.isActive) return { label: 'Active', color: '#16a34a', bg: '#dcfce7' }; // Green
        if (user.emailToken) return { label: 'Pending Verification', color: '#d97706', bg: '#fef3c7' }; // Yellow
        return { label: 'Banned', color: '#dc2626', bg: '#fee2e2' }; // Red
    };

    // STYLES
    const s = {
        container: { padding: '40px', background: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' },
        card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
        th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', fontSize: '12px', color: '#666', textTransform: 'uppercase' },
        td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' },
        btn: { border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginRight: '8px' }
    };

    if (loading) return <div style={{padding:'50px'}}>Loading...</div>;
    if (error) return <div style={{padding:'50px', color:'red'}}>{error}</div>;

    return (
        <div style={s.container}>
            <h1 style={{marginBottom: '30px', color: '#111'}}>🛡️ Super Admin Console</h1>

            {/* CLICKABLE STAT TABS */}
            <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
                <StatTab 
                    title="Users" 
                    value={stats.totalUsers} 
                    color="#2563eb" 
                    isActive={activeTab === 'users'} 
                    onClick={() => setActiveTab('users')} 
                />
                <StatTab 
                    title="Companies" 
                    value={stats.totalCompanies} 
                    color="#16a34a" 
                    isActive={activeTab === 'companies'} 
                    onClick={() => setActiveTab('companies')} 
                />
                {/* Revenue is just a stat for now, non-clickable */}
                <div style={{flex:1, background:'white', padding:'20px', borderRadius:'8px', borderTop:`4px solid #d97706`, boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
                    <div style={{color:'#888', fontSize:'12px', fontWeight: 'bold', textTransform:'uppercase'}}>Total Revenue</div>
                    <div style={{fontSize:'32px', fontWeight:'bold', color:'#333', marginTop:'5px'}}>${stats.totalPipelineValue.toLocaleString()}</div>
                </div>
            </div>

            {/* TAB CONTENT: USERS */}
            {activeTab === 'users' && (
                <div style={s.card}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                        <h3 style={{margin:0}}>👥 User Management</h3>
                        <span style={{fontSize:'12px', color:'#666'}}>{users.length} Users Found</span>
                    </div>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>User Details</th>
                                <th style={s.th}>Role</th>
                                <th style={s.th}>Status</th>
                                <th style={s.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => {
                                const status = getUserStatus(u);
                                return (
                                    <tr key={u.id}>
                                        <td style={s.td}>
                                            <div style={{fontWeight:'bold', color:'#333'}}>{u.email}</div>
                                            <div style={{fontSize:'12px', color:'#888', marginTop:'3px'}}>{u.name} • {u.company?.name}</div>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{background: '#f3f4f6', padding: '4px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'600'}}>{u.role}</span>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{background: status.bg, color: status.color, padding: '4px 10px', borderRadius:'12px', fontSize:'11px', fontWeight:'bold'}}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            {u.role !== 'SUPER_ADMIN' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleToggleUserStatus(u.id, !u.isActive)}
                                                        style={{...s.btn, background: u.isActive ? '#fff1f2' : '#f0fdf4', color: u.isActive ? '#e11d48' : '#16a34a'}}
                                                    >
                                                        {u.isActive ? '⛔ Ban' : '✅ Verify'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        style={{...s.btn, background: 'none', color: '#9ca3af', fontSize:'14px'}}
                                                        title="Delete User"
                                                    >
                                                        🗑
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB CONTENT: COMPANIES */}
            {activeTab === 'companies' && (
                <div style={s.card}>
                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                        <h3 style={{margin:0}}>🏢 Company Management</h3>
                        <span style={{fontSize:'12px', color:'#666'}}>{companies.length} Companies Registered</span>
                    </div>
                    <table style={s.table}>
                         <thead>
                            <tr>
                                <th style={s.th}>Company Name</th>
                                <th style={s.th}>Total Users</th>
                                <th style={s.th}>Status</th>
                                <th style={s.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(c => (
                                <tr key={c.id}>
                                    <td style={s.td}><b style={{color:'#333', fontSize:'15px'}}>{c.name}</b></td>
                                    <td style={s.td}>
                                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                            <span style={{fontSize:'14px'}}>👥</span>
                                            <span>{c._count?.users || 0}</span>
                                        </div>
                                    </td>
                                    <td style={s.td}>
                                        <span style={{
                                            color: c.isActive ? '#15803d' : '#b91c1c', 
                                            background: c.isActive ? '#dcfce7' : '#fee2e2',
                                            padding: '4px 10px', borderRadius:'12px', fontSize:'11px', fontWeight:'bold'
                                        }}>
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        <button 
                                            onClick={() => handleToggleCompany(c.id, c.isActive)} 
                                            style={{...s.btn, background: c.isActive ? '#fff' : '#f0fdf4', border: '1px solid #ddd', color: '#333'}}
                                        >
                                            {c.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// CLICKABLE STAT TAB COMPONENT
const StatTab = ({ title, value, color, isActive, onClick }) => (
    <div 
        onClick={onClick}
        style={{
            flex: 1, 
            background: isActive ? '#fff' : '#ffffff80', 
            padding: '20px', 
            borderRadius: '8px', 
            borderTop: `4px solid ${color}`, 
            boxShadow: isActive ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: isActive ? 'translateY(-4px)' : 'none',
            opacity: isActive ? 1 : 0.7
        }}
    >
        <div style={{color: '#666', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing:'0.5px'}}>{title}</div>
        <div style={{fontSize: '32px', fontWeight: '900', color: '#333', marginTop: '5px'}}>{value}</div>
        <div style={{fontSize: '11px', color: color, marginTop: '5px', fontWeight: '600'}}>
            {isActive ? '● VIEWING' : 'CLICK TO VIEW'}
        </div>
    </div>
);

export default AdminDashboard;