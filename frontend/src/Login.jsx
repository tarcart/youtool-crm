import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [bgImage, setBgImage] = useState('');

    // HOVER STATES
    const [isGoogleHover, setIsGoogleHover] = useState(false);
    const [isMicrosoftHover, setIsMicrosoftHover] = useState(false);
    const [isSignInHover, setIsSignInHover] = useState(false);
    const [isSignUpHover, setIsSignUpHover] = useState(false);

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

    // STYLES
    const ssoButtonStyle = (isHover) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e1e4e8',
        backgroundColor: isHover ? '#f8f9fa' : '#ffffff',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        width: '100%',
        transition: 'all 0.2s ease',
        marginBottom: '12px',
        color: '#24292e',
        boxShadow: isHover ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
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
            
            {/* CSS HACK: Force Chrome Autofill to be White */}
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

            {/* LEFT SIDE */}
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
                <a href="/" style={{ textDecoration: 'none', color: 'white', display: 'inline-block', width: 'fit-content' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1.5px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>YouTool</h1>
                </a>
                <p style={{ fontSize: '1.5rem', maxWidth: '550px', lineHeight: '1.5', fontWeight: '500', textShadow: '0 2px 8px rgba(0,0,0,0.3)', opacity: 0.95 }}>
                    Managing your business shouldn't be hard. <br/>Log in to access your ultimate workspace.
                </p>
            </div>

            {/* RIGHT SIDE */}
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
                <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    
                    {/* LOGO HEADER */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#0366d6', margin: 0, letterSpacing: '-2px' }}>YouTool</h2>
                    </div>

                    {/* SSO BUTTONS */}
                    <div style={{ marginBottom: '30px' }}>
                        <button type="button" 
                            style={ssoButtonStyle(isGoogleHover)}
                            onMouseEnter={() => setIsGoogleHover(true)} onMouseLeave={() => setIsGoogleHover(false)}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '20px', marginRight: '12px'}} />
                            Continue with Google
                        </button>
                        <button type="button" 
                            style={ssoButtonStyle(isMicrosoftHover)}
                            onMouseEnter={() => setIsMicrosoftHover(true)} onMouseLeave={() => setIsMicrosoftHover(false)}
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" style={{width: '20px', marginRight: '12px'}} />
                            Continue with Microsoft
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: '#e1e4e8' }}>
                        <hr style={{ flex: 1, border: '0.5px solid #e1e4e8' }} />
                        <span style={{ padding: '0 16px', fontSize: '13px', color: '#6a737d', fontWeight: '600' }}>OR</span>
                        <hr style={{ flex: 1, border: '0.5px solid #e1e4e8' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter your email" 
                            style={inputStyle}
                            required
                        />
                        
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password"
                            style={inputStyle}
                            required
                        />

                        <button type="submit" 
                            style={{ 
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: isSignInHover ? '#005cc5' : '#0366d6', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontSize: '16px', 
                                fontWeight: '700',
                                marginTop: '10px',
                                transition: 'all 0.2s',
                                boxShadow: isSignInHover ? '0 6px 16px rgba(3,102,214,0.3)' : '0 4px 12px rgba(3,102,214,0.15)',
                                transform: isSignInHover ? 'translateY(-1px)' : 'translateY(0)'
                            }}
                            onMouseEnter={() => setIsSignInHover(true)} onMouseLeave={() => setIsSignInHover(false)}
                        >
                            Sign In
                        </button>

                        {/* HELPER LINKS */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginTop: '24px', 
                            fontSize: '15px', 
                            gap: '15px' 
                        }}>
                            <a href="/login-assistance" style={{ color: '#444', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} 
                               onMouseOver={(e) => e.target.style.color = '#0366d6'} 
                               onMouseOut={(e) => e.target.style.color = '#444'}>
                               Login Assistance
                            </a>
                            <span style={{ color: '#ccc' }}>|</span>
                            <a href="/demo" style={{ color: '#0366d6', textDecoration: 'none', fontWeight: '500' }}
                               onMouseOver={(e) => e.target.style.textDecoration = 'underline'} 
                               onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                               Request a demo
                            </a>
                        </div>
                    </form>

                    {/* SIGN UP BUTTON - BOLDER & BETTER */}
                    <div style={{ marginTop: '50px' }}>
                         <button type="button" 
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: isSignUpHover ? '#f1f8ff' : 'transparent',
                                color: '#0366d6',
                                border: '2px solid #0366d6', // Thicker border
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '700', // Bolder text
                                transition: 'all 0.2s'
                            }}
                            onClick={() => window.location.href='/register'}
                            onMouseEnter={() => setIsSignUpHover(true)} onMouseLeave={() => setIsSignUpHover(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    {message && (
                        <p style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', textAlign: 'center', backgroundColor: message.includes('✅') ? '#f0fff4' : '#ffebe9', color: message.includes('✅') ? '#22863a' : '#d73a49', border: `1px solid ${message.includes('✅') ? '#22863a' : '#d73a49'}`, fontSize: '14px' }}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;