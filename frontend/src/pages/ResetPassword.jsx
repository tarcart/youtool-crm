import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New State
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { token } = useParams();
    const navigate = useNavigate();
    const [bgImage, setBgImage] = useState('');
    const [isSubmitHover, setIsSubmitHover] = useState(false);

    useEffect(() => {
        const images = ['https://images.unsplash.com/photo-1499750310107-5fef28a66643', 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'];
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        setBgImage(images[dayOfYear % images.length]);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setMessage('⚠️ Passwords do not match'); return; }
        setLoading(true);
        try {
            await axios.post('/api/auth/reset-password', { token, newPassword });
            setMessage('✅ Success! Redirecting...');
            setTimeout(() => navigate('/signin'), 3000);
        } catch (err) {
            setMessage('⚠️ ' + (err.response?.data?.error || 'Failed to reset.'));
        } finally { setLoading(false); }
    };

    const inputWrapperStyle = { position: 'relative', width: '100%' };
    const inputStyle = { width: '100%', padding: '14px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #d1d5da', fontSize: '15px', boxSizing: 'border-box', marginBottom: '16px', outline: 'none' };
    const toggleStyle = { position: 'absolute', right: '12px', top: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif', backgroundColor: 'white' }}>
            <div style={{ flex: '1.2', backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', color: 'white' }}>
                <h1 style={{ fontSize: '4rem', fontWeight: '800' }}>YouTool</h1>
                <p style={{ fontSize: '1.5rem' }}>Set a new password and get back to business.</p>
            </div>
            <div style={{ flex: '0.8', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f8ff', color: '#0366d6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '24px' }}>🔑</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0366d6' }}>Reset Password</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={inputWrapperStyle}>
                            <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" style={inputStyle} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleStyle}>{showPassword ? '👁️' : '🙈'}</button>
                        </div>
                        <div style={inputWrapperStyle}>
                            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" style={inputStyle} required />
                        </div>
                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#0366d6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                            {loading ? 'Updating...' : 'Set New Password'}
                        </button>
                    </form>
                    <div style={{ marginTop: '24px' }}>
                        <Link to="/signin" style={{ color: '#0366d6', textDecoration: 'none', fontWeight: '600' }}>← Back to Sign In</Link>
                    </div>
                    {message && <div style={{ marginTop: '20px', color: '#2d3748' }}>{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;