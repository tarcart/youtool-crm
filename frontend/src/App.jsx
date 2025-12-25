import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

// LAYOUTS
import PublicLayout from './components/PublicLayout';

// PAGES
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './components/Dashboard';
import SolutionsPage from './pages/SolutionsPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import FeaturesPage from './pages/FeaturesPage';
import Register from './Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; 

// COMPONENTS
import CreateModal from './components/CreateModal';
import RightSlider from './components/RightSlider';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const ProtectedRoute = ({ children }) => {
        if (!user) return <Navigate to="/login" />;
        return children;
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Routes>
            {/* PUBLIC PAGES (WRAPPED IN LAYOUT) */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* AUTH (LOGIN ONLY) */}
            <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />

            {/* DASHBOARD */}
            <Route path="/dashboard/*" element={
                <ProtectedRoute>
                    <MainAppLayout user={user} onLogout={handleLogout} />
                </ProtectedRoute>
            } />
            
            {/* ADMIN DASHBOARD (SUPER ADMIN ONLY) */}
            <Route path="/admin" element={
                <ProtectedRoute>
                    {user?.role === 'SUPER_ADMIN' ? (
                        <div style={{ display: 'flex' }}>
                            <div style={{width: '240px', background: '#fff', height: '100vh', borderRight: '1px solid #ddd', padding:'20px'}}>
                                <h2 style={{color: '#d94d11'}}>Admin</h2>
                                <button onClick={() => navigate('/dashboard')} style={{marginTop:'20px', cursor:'pointer', padding: '10px', width: '100%'}}>Back to CRM</button>
                            </div>
                            <div style={{flex: 1}}><AdminDashboard /></div>
                        </div>
                    ) : <Navigate to="/dashboard" />}
                </ProtectedRoute>
            } />
        </Routes>
    );
};

// --- CRM LAYOUT (FULLY RESTORED) ---
const MainAppLayout = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [opps, setOpps] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = '/api';
            const [cRes, oRes, oppRes, pRes, tRes] = await Promise.all([
                axios.get(`${baseUrl}/contacts?search=${searchQuery}`, { headers }),
                axios.get(`${baseUrl}/organizations`, { headers }),
                axios.get(`${baseUrl}/opportunities`, { headers }),
                axios.get(`${baseUrl}/projects`, { headers }).catch(() => ({data:[]})),
                axios.get(`${baseUrl}/tasks`, { headers }).catch(() => ({data:[]}))
            ]);
            setContacts(cRes?.data || []); setOrgs(oRes?.data || []); setOpps(oppRes?.data || []);
            setProjects(pRes?.data || []); setTasks(tRes?.data || []);
        } catch (err) { console.error("Fetch error:", err); }
    };
    useEffect(() => { if (user) fetchData(); }, [user, searchQuery]);

    const currentData = (() => {
        switch (activeTab) {
            case 'contacts': return contacts;
            case 'organizations': return orgs;
            case 'opportunities': return opps;
            case 'projects': return projects;
            case 'tasks': return tasks;
            default: return [];
        }
    })();

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} items?`)) return;
        try {
            const token = localStorage.getItem('token');
            await Promise.all(selectedIds.map(id => axios.delete(`/api/${activeTab}/${id}`, { headers: { Authorization: `Bearer ${token}` } })));
            setSelectedIds([]); fetchData();
        } catch (err) { alert("Bulk delete failed."); }
    };

    const getNavItems = () => {
        const items = [
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'tasks', label: 'Tasks', icon: '✔️' },
            { id: 'contacts', label: 'Contacts', icon: '👤' },
            { id: 'organizations', label: 'Organizations', icon: '🏢' },
            { id: 'opportunities', label: 'Opportunities', icon: '💰' },
            { id: 'projects', label: 'Projects', icon: '🔨' },
            { id: 'reports', label: 'Reports', icon: '📊' }
        ];
        if (user?.role === 'SUPER_ADMIN') items.push({ id: 'admin', label: 'Super Admin', icon: '👑' });
        return items;
    };
    const handleTabClick = (tabId) => {
        if (tabId === 'admin') navigate('/admin');
        else { setActiveTab(tabId); setSelectedItem(null); setSelectedIds([]); }
    };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#fff', overflow: 'hidden' }}>
            <div style={{ borderRight: '1px solid #e1e6eb', width: sidebarExpanded ? '240px' : '68px', display: 'flex', flexDirection: 'column', transition: 'width 0.3s' }}>
                <div style={{ height: '64px', borderBottom: '1px solid #e1e6eb', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                    <button onClick={() => setSidebarExpanded(!sidebarExpanded)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>☰</button>
                    {sidebarExpanded && <span style={{ fontWeight: '900', color: '#d94d11', fontSize: '20px', marginLeft: '10px' }}>YouTool</span>}
                </div>
                <nav style={{ padding: '10px 0', flex: 1 }}>
                    {getNavItems().map(tab => (
                        <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{ width: '100%', height: '52px', border: 'none', background: activeTab === tab.id ? '#fef2f2' : 'none', color: activeTab === tab.id ? '#d94d11' : '#555', display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: sidebarExpanded ? '20px' : '0', justifyContent: sidebarExpanded ? 'flex-start' : 'center' }}>
                            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                            {sidebarExpanded && <span style={{ marginLeft: '12px', fontSize: '13px', fontWeight: '700' }}>{tab.label}</span>}
                        </button>
                    ))}
                </nav>
                <div style={{ padding: '15px', borderTop: '1px solid #eee' }}>
                    <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: sidebarExpanded ? 'flex-start' : 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                        <span style={{ fontSize: '18px' }}>🚪</span>
                        {sidebarExpanded && <span style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 'bold' }}>Logout</span>}
                    </button>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fcfcfc' }}>
                <div style={{ height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', borderBottom: '1px solid #e1e6eb', backgroundColor: '#fff' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{activeTab.toUpperCase()}</h2>
                    {activeTab !== 'home' && (
                        <div>
                            {selectedIds.length > 0 ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setSelectedIds([])} style={{ background: '#fff', border: '1px solid #ddd', padding: '8px 18px', borderRadius: '4px' }}>Cancel</button>
                                    <button onClick={handleBulkDelete} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '4px' }}>Delete ({selectedIds.length})</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsCreateModalOpen(true)} style={{ background: '#d94d11', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>+ New {activeTab.slice(0,-1)}</button>
                            )}
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {activeTab === 'home' ? <Dashboard /> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                                    <th style={{ width: '50px', padding: '15px' }}><input type="checkbox" checked={currentData.length > 0 && selectedIds.length === currentData.length} onChange={() => setSelectedIds(selectedIds.length === currentData.length ? [] : currentData.map(i => i.id))} /></th>
                                    <th style={{ padding: '15px', fontSize: '11px', color: '#666' }}>NAME</th>
                                    <th style={{ padding: '15px', fontSize: '11px', color: '#666' }}>INFO</th>
                                    <th style={{ padding: '15px', fontSize: '11px', color: '#666' }}>DETAILS</th>
                                    <th style={{ padding: '15px', fontSize: '11px', color: '#666' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map(item => (
                                    <tr key={item.id} onClick={() => setSelectedItem({type: activeTab, data: item})} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                                        <td style={{ padding: '15px' }} onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds(selectedIds.includes(item.id) ? selectedIds.filter(i => i !== item.id) : [...selectedIds, item.id])} /></td>
                                        <td style={{ padding: '15px', fontSize: '13px' }}><b>{item.firstName ? `${item.firstName} ${item.lastName}` : (item.name || item.subject)}</b></td>
                                        <td style={{ padding: '15px', fontSize: '13px' }}>{item.jobTitle || item.industry || item.stage || item.status}</td>
                                        <td style={{ padding: '15px', fontSize: '13px' }}>{item.email || item.priority}</td>
                                        <td style={{ padding: '15px', fontSize: '13px' }}>{item.value ? `$${item.value}` : 'View'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <CreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} activeTab={activeTab} refresh={fetchData} user={user} allOrgs={orgs} allContacts={contacts} allOpps={opps} allProjects={projects} allTasks={tasks} />
            {selectedItem && <RightSlider selectedItem={selectedItem} onClose={() => setSelectedItem(null)} refresh={fetchData} allContacts={contacts} allOrgs={orgs} allOpps={opps} allProjects={projects} allTasks={tasks} />}
        </div>
    );
};

export default App;