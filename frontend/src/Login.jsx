import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [bgImage, setBgImage] = useState('');

    const [hoveredBtn, setHoveredBtn] = useState(null);
    const [isSignInHover, setIsSignInHover] = useState(false);

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

    // Inside Login.jsx
const handleSocialLogin = (provider) => {
    if (provider === 'apple') {
        window.location.href = '/apple-launch';
        return;
    }
    
    // Redirect Office 365 and Live ID to the unified 'microsoft' route
    const backendProvider = (provider === 'office365' || provider === 'liveid') 
        ? 'microsoft' 
        : provider;

    window.location.href = `/api/auth/${backendProvider}`;
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            const userName = response.data.user.name.split(' ')[0];
            setMessage('✅ Success! Welcome back, ' + userName + '.');
            setTimeout(() => {
                if (onLoginSuccess) onLoginSuccess(response.data.user);
                window.location.href = '/dashboard';
            }, 1000);
        } catch (error) {
            setMessage('⚠️ Sign in failed. Check your credentials.');
        }
    };

    const ssoButtonStyle = (id) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #e1e4e8',
        backgroundColor: hoveredBtn === id ? '#f8f9fa' : '#ffffff',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        width: '100%',
        transition: 'all 0.2s ease',
        color: '#24292e',
        boxShadow: hoveredBtn === id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
    });

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
        <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <style>
                {`input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px white inset !important; }`}
            </style>
            <div style={{ flex: '1.2', backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', color: 'white' }}>
                <a href="/" style={{ textDecoration: 'none', color: 'white' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1.5px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>YouTool</h1>
                </a>
                <p style={{ fontSize: '1.5rem', maxWidth: '550px', lineHeight: '1.5', fontWeight: '500', textShadow: '0 2px 8px rgba(0,0,0,0.3)', opacity: 0.95 }}>
                    Managing your business shouldn't be hard. <br/>Sign in to access your ultimate workspace.
                </p>
            </div>
            <div style={{ flex: '0.8', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#0366d6', margin: "0 0 30px 0", letterSpacing: '-2px' }}>YouTool</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        <button type="button" onClick={() => handleSocialLogin('google')} style={ssoButtonStyle('google')} onMouseEnter={() => setHoveredBtn('google')} onMouseLeave={() => setHoveredBtn(null)}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{width: '16px', marginRight: '8px'}} /> Google
                        </button>
                        <button type="button" onClick={() => handleSocialLogin('apple')} style={ssoButtonStyle('apple')} onMouseEnter={() => setHoveredBtn('apple')} onMouseLeave={() => setHoveredBtn(null)}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="" style={{width: '16px', marginRight: '8px'}} /> Apple
                        </button>
                        <button type="button" onClick={() => handleSocialLogin('facebook')} style={ssoButtonStyle('fb')} onMouseEnter={() => setHoveredBtn('fb')} onMouseLeave={() => setHoveredBtn(null)}>
                            <img src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg" alt="" style={{width: '16px', marginRight: '8px'}} /> Facebook
                        </button>
                        <button type="button" onClick={() => handleSocialLogin('microsoft')} style={ssoButtonStyle('ms')} onMouseEnter={() => setHoveredBtn('ms')} onMouseLeave={() => setHoveredBtn(null)}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="" style={{width: '16px', marginRight: '8px'}} /> Microsoft
                        </button>
                        <button type="button" onClick={() => handleSocialLogin('office365')} style={ssoButtonStyle('o365')} onMouseEnter={() => setHoveredBtn('o365')} onMouseLeave={() => setHoveredBtn(null)}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg" alt="" style={{width: '16px', marginRight: '8px'}} /> Office 365
                        </button>
                        <button type="button" onClick={() => handleSocialLogin('liveid')} style={ssoButtonStyle('live')} onMouseEnter={() => setHoveredBtn('live')} onMouseLeave={() => setHoveredBtn(null)}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Account_Logo.svg" alt="" style={{width: '16px', marginRight: '8px'}} /> Live ID
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: '#e1e4e8' }}>
                        <hr style={{ flex: 1, border: '0.5px solid #e1e4e8' }} /><span style={{ padding: '0 16px', fontSize: '12px', color: '#6a737d', fontWeight: '600' }}>OR EMAIL</span><hr style={{ flex: 1, border: '0.5px solid #e1e4e8' }} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} required />
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={inputStyle} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#718096' }}>
                                {showPassword ? '👁️' : '⊙'} 
                            </button>
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: isSignInHover ? '#005cc5' : '#0366d6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '10px' }} onMouseEnter={() => setIsSignInHover(true)} onMouseLeave={() => setIsSignInHover(false)}>Sign In</button>
                    </form>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', fontSize: '14px', gap: '15px' }}>
                        <a href="/forgot-password" style={{ color: '#444', textDecoration: 'none' }}>Forgot Password?</a>
                        <span style={{ color: '#ccc' }}>|</span>
                        <a href="/register" style={{ color: '#0366d6', textDecoration: 'none', fontWeight: '600' }}>Create account</a>
                    </div>
                    {message && (
                        <div style={{ marginTop: '25px', padding: '16px', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #edf2f7', borderLeft: `5px solid ${message.includes('✅') ? '#22863a' : '#d73a49'}`, color: '#2d3748', fontSize: '14px' }}>{message}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;