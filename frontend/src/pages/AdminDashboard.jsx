import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    // 1. STATE
    const [stats, setStats] = useState({ totalCompanies: 0, totalUsers: 0, totalOpportunities: 0, totalPipelineValue: 0 });
    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 2. CONFIG
    const token = localStorage.getItem('token');
    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const baseUrl = '/api';

    // 3. FETCH
    const fetchData = async () => {
        try {
            const statsRes = await fetch(`${baseUrl}/admin/stats`, { headers });
            if (!statsRes.ok) throw new Error("Failed to fetch data.");
            const statsData = await statsRes.json();

            const compRes = await fetch(`${baseUrl}/admin/companies`, { headers });
            const compData = await compRes.json();

            const usersRes = await fetch(`${baseUrl}/admin/users`, { headers });
            const usersData = await usersRes.json();

            setStats(statsData);
            setCompanies(compData);
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // 4. ACTIONS
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            const res = await fetch(`${baseUrl}/admin/users/${userId}`, { method: 'DELETE', headers });
            if (!res.ok) throw new Error("Failed to delete");
            setUsers(users.filter(u => u.id !== userId));
            setStats({...stats, totalUsers: stats.totalUsers - 1});
        } catch (err) { alert(err.message); }
    };

    const handleToggleCompany = async (companyId, currentStatus) => {
        try {
            const res = await fetch(`${baseUrl}/admin/companies/${companyId}/status`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (!res.ok) throw new Error("Failed to update");
            setCompanies(companies.map(c => c.id === companyId ? { ...c, isActive: !currentStatus } : c));
        } catch (err) { alert(err.message); }
    };

    // --- STYLES (The Fix) ---
    const styles = {
        container: { padding: '40px', backgroundColor: '#f4f4f4', minHeight: '100vh', color: '#333' },
        header: { fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#111' },
        gridStats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
        gridTables: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
        card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
        tableTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#222' },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
        th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd', color: '#555', textTransform: 'uppercase', fontSize: '12px' },
        td: { padding: '12px', borderBottom: '1px solid #eee', color: '#333', fontWeight: '500' },
        
        // Buttons
        btnRed: { backgroundColor: '#dc2626', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
        btnGreen: { backgroundColor: '#16a34a', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
        btnTrash: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#dc2626' },
        
        // Badges
        badgeActive: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },
        badgeInactive: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },
        badgeRole: { backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }
    };

    if (loading) return <div style={{ padding: '40px', color: '#333', textAlign: 'center' }}>Loading Super Admin Dashboard...</div>;
    if (error) return <div style={{ padding: '40px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>👑 Super Admin Dashboard</h1>

            {/* STATS */}
            <div style={styles.gridStats}>
                <StatCard title="Total Companies" value={stats.totalCompanies} color="#2563eb" />
                <StatCard title="Total Users" value={stats.totalUsers} color="#16a34a" />
                <StatCard title="Total Opportunities" value={stats.totalOpportunities} color="#9333ea" />
                <StatCard title="Pipeline Value" value={`$${stats.totalPipelineValue.toLocaleString()}`} color="#ea580c" />
            </div>

            {/* TABLES */}
            <div style={styles.gridTables}>
                
                {/* Companies */}
                <div style={styles.card}>
                    <h2 style={styles.tableTitle}>🏢 Manage Companies</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Company</th>
                                <th style={styles.th}>Users</th>
                                <th style={{...styles.th, textAlign:'center'}}>Status</th>
                                <th style={{...styles.th, textAlign:'center'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(c => (
                                <tr key={c.id}>
                                    <td style={styles.td}>{c.name}</td>
                                    <td style={styles.td}>{c._count?.users || 0}</td>
                                    <td style={{...styles.td, textAlign:'center'}}>
                                        <span style={c.isActive ? styles.badgeActive : styles.badgeInactive}>
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{...styles.td, textAlign:'center'}}>
                                        <button 
                                            onClick={() => handleToggleCompany(c.id, c.isActive)}
                                            style={c.isActive ? styles.btnRed : styles.btnGreen}
                                        >
                                            {c.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Users */}
                <div style={styles.card}>
                    <h2 style={styles.tableTitle}>👥 Manage Users</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={{...styles.th, textAlign:'center'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td style={styles.td}>
                                        <div style={{fontWeight:'bold'}}>{u.email}</div>
                                        <div style={{fontSize:'11px', color:'#666'}}>{u.company?.name}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={u.role === 'SUPER_ADMIN' ? styles.badgeRole : {}}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{...styles.td, textAlign:'center'}}>
                                        {u.role !== 'SUPER_ADMIN' && (
                                            <button 
                                                onClick={() => handleDeleteUser(u.id)}
                                                style={styles.btnTrash}
                                                title="Delete User"
                                            >
                                                🗑
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

// Stat Card Sub-component
const StatCard = ({ title, value, color }) => (
    <div style={{ backgroundColor: color, padding: '25px', borderRadius: '8px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.9, marginBottom: '5px' }}>{title}</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{value}</p>
    </div>
);

export default AdminDashboard;