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
        // REPAIR: Updated to use /signin
        if (!user) return <Navigate to="/signin" />;
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
                {/* VERIFIED: Forgot/Reset routes are here */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* AUTH (CHANGED TO SIGNIN) */}
            <Route path="/signin" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />

            {/* DASHBOARD */}
            <Route path="/dashboard/*" element={
                <ProtectedRoute>
                    <MainAppLayout user={user} onLogout={handleLogout} />
                </ProtectedRoute>
            } />
            
            {/* ADMIN DASHBOARD */}
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

            {/* REPAIR: Redirect /login to /signin so users don't get 404s */}
            <Route path="/login" element={<Navigate to="/signin" replace />} />
        </Routes>
    );
};

// ... Rest of MainAppLayout component ...