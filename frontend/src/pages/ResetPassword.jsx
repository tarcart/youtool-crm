import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    // STATE
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // URL PARAMS
    const { token } = useParams();
    const navigate = useNavigate();

    // VISUAL STATE
    const [bgImage, setBgImage] = useState('');
    const [isSubmitHover, setIsSubmitHover] = useState(false);

    // BACKGROUND ROTATOR (Consistent with other auth pages)
    useEffect(() => {
        const images = [
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
            'https://images.unsplash.com/photo-1449034446853-66c86144b0ad',
            'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
        ];
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        setBgImage(images[dayOfYear % images.length]);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Client-side validation
        if (newPassword !== confirmPassword) {
            setMessage('⚠️ Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('⚠️ Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await axios.post('/api/auth/reset-password', { 
                token, 
                newPassword 
            });

            setMessage('✅ Success! Redirecting to Sign In...');
            
            // Wait 3 seconds so they can read the message, then send to login
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to reset password.';
            setMessage('⚠️ ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // STYLES
    const inputStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #d1d5da',
        fontSize: '15px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        marginBottom: '16px',
        transition: 'all 0.2s ease',
        outline: 'none'
    };

    return (
        <div style={{ 
            // FIXED POSITION: Cover any existing menu headers
            position: 'fixed', 
            top: 0, 
            left: 0, 
            zIndex: 9999,
            display: 'flex', 
            height: '100vh', 
            width: '100vw', 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: 'white'
        }}>
            
            <style>
                {`
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover, 
                    input:-webkit-autofill:focus, 
                    input:-webkit-autofill:active{
                        -webkit-box-shadow: 0 0 0 30px white inset !important;
                    }
                `}
            </style>

            {/* LEFT SIDE: IMAGE */}
            <div style={{
                flex: '1.2',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '80px',
                color: 'white'
            }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'inline-block', width: 'fit-content' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1.5px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>YouTool</h1>
                </Link>
                <p style={{ fontSize: '1.5rem', maxWidth: '550px', lineHeight: '1.5', fontWeight: '500', textShadow: '0 2px 8px rgba(0,0,0,0.3)', opacity: 0.95 }}>
                    Almost there. <br/>
                    Set a new password and get back to business.
                </p>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div style={{
                flex: '0.8',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                overflowY: 'auto',
                paddingBottom: '120px' 
            }}>
                <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative' }}>
                    
                    {/* HEADER */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ 
                            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f8ff', 
                            color: '#0366d6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px auto', fontSize: '24px'
                        }}>
                           🔑
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0366d6', margin: 0, letterSpacing: '-1px' }}>
                            Reset Password
                        </h2>
                        <p style={{ color: '#656d76', fontSize: '15px', marginTop: '10px' }}>
                            Please choose a strong password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="New Password" 
                            style={inputStyle}
                            required
                            minLength={6}
                        />
                        
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Confirm New Password" 
                            style={inputStyle}
                            required
                            minLength={6}
                        />

                        <button type="submit" 
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: loading ? '#94d3a2' : (isSubmitHover ? '#005cc5' : '#0366d6'), 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: loading ? 'not-allowed' : 'pointer', 
                                fontSize: '16px', 
                                fontWeight: '700',
                                marginTop: '10px',
                                transition: 'all 0.2s',
                                boxShadow: isSubmitHover && !loading ? '0 6px 16px rgba(3,102,214,0.3)' : '0 4px 12px rgba(3,102,214,0.15)',
                                transform: isSubmitHover && !loading ? 'translateY(-1px)' : 'translateY(0)'
                            }}
                            onMouseEnter={() => setIsSubmitHover(true)} onMouseLeave={() => setIsSubmitHover(false)}
                        >
                            {loading ? 'Updating...' : 'Set New Password'}
                        </button>
                    </form>

                    {/* BACK LINK (In case they remember it suddenly) */}
                    <div style={{ marginTop: '24px' }}>
                        <Link to="/login" 
                           style={{ color: '#0366d6', textDecoration: 'none', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           ← Back to Sign In
                        </Link>
                    </div>

                    {/* MESSAGE BOX */}
                    {message && (
                        <div style={{ 
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            marginTop: '25px',
                            padding: '16px', 
                            paddingRight: '35px', 
                            borderRadius: '6px',
                            textAlign: 'center', 
                            backgroundColor: '#ffffff',
                            border: '1px solid #edf2f7',
                            borderLeft: `5px solid ${message.includes('✅') ? '#22863a' : '#d73a49'}`,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            color: '#2d3748',
                            fontSize: '14px',
                            animation: 'slideUp 0.3s ease-out',
                            zIndex: 10
                        }}>
                            <style>{`
                                @keyframes slideUp {
                                    from { opacity: 0; transform: translateY(10px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                            `}</style>

                            <span 
                                onClick={() => setMessage('')} 
                                style={{
                                    position: 'absolute', top: '8px', right: '10px', cursor: 'pointer',
                                    fontSize: '18px', fontWeight: 'bold', lineHeight: '1', color: '#a0aec0'
                                }}
                            >
                                ✕
                            </span>

                            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span>{message}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;