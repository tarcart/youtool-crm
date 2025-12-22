import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [bgImage, setBgImage] = useState('');

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
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setMessage(`✅ Success! Welcome to ${response.data.user.companyName}`);
            if (onLoginSuccess) onLoginSuccess(response.data.user);
        } catch (error) {
            setMessage('❌ Login failed. Check your credentials.');
        }
    };

    const ssoButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        width: '100%',
        transition: 'all 0.2s ease'
    };

    const secondaryButtonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '2px solid #007bff',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
        transition: 'all 0.3s'
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            
            {/* LEFT SIDE: Daily Dynamic Background */}
            <div style={{
                flex: '1.2',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '60px',
                color: 'white'
            }}>
                {/* 1. HOT LOGO: Clicks back to home */}
                <a href="/" style={{ textDecoration: 'none', color: 'white', display: 'inline-block', width: 'fit-content' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }}>YouTool</h1>
                </a>
                <p style={{ fontSize: '1.2rem', maxWidth: '500px', lineHeight: '1.6' }}>
                    Managing your business shouldn't be hard. Log in to access your ultimate workspace.
                </p>
            </div>

            {/* RIGHT SIDE: Clean Login Form */}
            <div style={{
                flex: '0.8',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                overflowY: 'auto'
            }}>
                <div style={{ width: '100%', maxWidth: '380px' }}>
                    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>Sign In</h2>
                    <p style={{ color: '#777', marginBottom: '30px' }}>Welcome back! Please enter your details.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                        <button type="button" style={ssoButtonStyle}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '18px', marginRight: '10px'}} />
                            Continue with Google
                        </button>
                        <button type="button" style={ssoButtonStyle}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" style={{width: '18px', marginRight: '10px'}} />
                            Continue with Microsoft
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#eee' }}>
                        <hr style={{ flex: 1, border: '0.5px solid #eee' }} />
                        <span style={{ padding: '0 10px', fontSize: '12px', color: '#999', fontWeight: 'bold' }}>OR</span>
                        <hr style={{ flex: 1, border: '0.5px solid #eee' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Work Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="name@company.com"
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }} 
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }} 
                                required
                            />
                        </div>

                        {/* 2. PASSWORD RESET LINK */}
                        <div style={{ textAlign: 'right' }}>
                            <a href="/forgot-password" style={{ color: '#007bff', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>
                        </div>

                        <button type="submit" style={{ 
                            width: '100%', 
                            padding: '14px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}>
                            Sign In
                        </button>

                        {/* 3. SIGN UP BUTTON */}
                        <button type="button" style={secondaryButtonStyle} onClick={() => window.location.href='/register'}>
                            Create Free Account
                        </button>

                        {/* 4. REQUEST DEMO BUTTON */}
                        <button type="button" style={{ ...secondaryButtonStyle, border: 'none', color: '#666', fontSize: '14px', marginTop: '0' }} onClick={() => window.location.href='/demo'}>
                            Questions? Request a Demo
                        </button>
                    </form>

                    {message && (
                        <p style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', textAlign: 'center', backgroundColor: message.includes('✅') ? '#e6fffa' : '#fff5f5', color: message.includes('✅') ? '#2c7a7b' : '#c53030', border: '1px solid currentColor', fontSize: '14px' }}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;