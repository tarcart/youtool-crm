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
        setMessage(''); // Clear previous messages
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setMessage(`✅ Success! Welcome back, ${response.data.user.name.split(' ')[0]}.`);
            
            setTimeout(() => {
                if (onLoginSuccess) onLoginSuccess(response.data.user);
                window.location.href = '/dashboard';
            }, 1000);

        } catch (error) {
            setMessage('⚠️ Login failed. Check your credentials.');
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
                overflowY: 'auto',
                // Extra padding at bottom allows scrolling if the error box hangs low on small screens
                paddingBottom: '120px' 
            }}>
                {/* CONTENT CONTAINER 
                    position: relative -> This is the ANCHOR. The error box will hang off the bottom of this div.
                */}
                <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative' }}>
                    
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
                            <a href="/forgot-password" style={{ color: '#444', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} 
                               onMouseOver={(e) => e.target.style.color = '#0366d6'} 
                               onMouseOut={(e) => e.target.style.color = '#444'}>
                               Forgot Password?
                            </a>
                            <span style={{ color: '#ccc' }}>|</span>
                            <a href="/register" style={{ color: '#0366d6', textDecoration: 'none', fontWeight: '500' }}
                               onMouseOver={(e) => e.target.style.textDecoration = 'underline'} 
                               onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                               Create an account
                            </a>
                        </div>
                    </form>

                    {/* ERROR MESSAGE (THE SPRUCED UP VERSION) 
                        It is absolute positioned relative to the FORM container above.
                        This keeps it locked to the bottom of the links, but prevents "jumping".
                    */}
                    {message && (
                        <div style={{ 
                            position: 'absolute',
                            top: '100%', // Pushes it exactly below the links
                            left: 0,
                            width: '100%',
                            marginTop: '25px', // Little bit of breathing room
                            padding: '16px', 
                            paddingRight: '35px', 
                            borderRadius: '6px', // Sleek corners
                            textAlign: 'center', 
                            
                            // MODERN STYLE
                            backgroundColor: '#ffffff',
                            border: '1px solid #edf2f7',
                            borderLeft: `5px solid ${message.includes('✅') ? '#22863a' : '#d73a49'}`, // Accent Bar
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // Nice shadow
                            
                            color: '#2d3748',
                            fontSize: '14px',
                            animation: 'slideUp 0.3s ease-out',
                            zIndex: 10
                        }}>
                            
                            {/* ANIMATION KEYFRAMES */}
                            <style>{`
                                @keyframes slideUp {
                                    from { opacity: 0; transform: translateY(10px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                            `}</style>

                            {/* CLOSE BUTTON */}
                            <span 
                                onClick={() => setMessage('')} 
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '10px',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    lineHeight: '1',
                                    color: '#a0aec0',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#4a5568'}
                                onMouseOut={(e) => e.target.style.color = '#a0aec0'}
                            >
                                ✕
                            </span>

                            <div style={{ fontWeight: '600', marginBottom: message.includes('✅') ? '0' : '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {/* Icon is part of the text now for better alignment */}
                                <span>{message}</span>
                            </div>

                            {!message.includes('✅') && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: '15px', 
                                    fontSize: '13px', 
                                    marginTop: '8px',
                                    paddingTop: '8px',
                                    borderTop: '1px solid #edf2f7'
                                }}>
                                    <a href="/forgot-password" style={{ color: '#d73a49', textDecoration: 'none', fontWeight: '600' }} onMouseOver={(e) => e.target.style.textDecoration='underline'} onMouseOut={(e) => e.target.style.textDecoration='none'}>Reset Password</a>
                                    <a href="/support" style={{ color: '#718096', textDecoration: 'none', fontWeight: '600' }} onMouseOver={(e) => e.target.style.textDecoration='underline'} onMouseOut={(e) => e.target.style.textDecoration='none'}>Contact Support</a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;