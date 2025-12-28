import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false); // REPAIR: Discreet state for toggle
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [bgImage, setBgImage] = useState('');
    const [isSubmitHover, setIsSubmitHover] = useState(false);

    useEffect(() => {
        const images = [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44', 
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', 
            'https://images.unsplash.com/photo-1563720223185-11003d516935'
        ];
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        setBgImage(images[dayOfYear % images.length]);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 
        
        if (formData.password !== formData.confirmPassword) {
            setIsSuccess(false);
            setMessage('❌ Passwords do not match');
            return;
        }

        try {
            await axios.post('/api/auth/register', {
                name: formData.name,
                companyName: formData.companyName,
                email: formData.email,
                password: formData.password
            });

            setIsSuccess(true);
            setMessage('✅ Account created! Please check your email to verify.');
            
            setFormData({
                name: '',
                companyName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

        } catch (error) {
            console.error("Registration Error:", error);
            setIsSuccess(false);
            const errorMsg = error.response?.data?.error || 'Registration failed.';
            setMessage(`❌ ${errorMsg}`);
        }
    };

    // STYLES
    const inputStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #e1e4e8',
        fontSize: '15px',
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa',
        marginBottom: '14px',
        transition: 'all 0.2s ease',
        outline: 'none'
    };

    const orangeBase = '#FF5722';
    const orangeHover = '#E64A19';

    return (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto'
        }}>
            <style>
                {`
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover, 
                    input:-webkit-autofill:focus, 
                    input:-webkit-autofill:active{
                        -webkit-box-shadow: 0 0 0 30px #f8f9fa inset !important;
                    }
                `}
            </style>

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(3px)' }}></div>

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', width: '100%', maxWidth: '1200px', padding: '40px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '80px' }}>
                <div style={{ flex: '1 1 500px', color: 'white' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <a href="/" style={{ textDecoration: 'none', color: 'white', display: 'inline-block' }}>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1.5px', cursor: 'pointer' }}>YouTool</h1>
                        </a>
                    </div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.1' }}>Manage Everything.<br/><span style={{ color: orangeBase }}>Achieve More.</span></h2>
                    <p style={{ fontSize: '1.4rem', opacity: 0.95, maxWidth: '500px', lineHeight: '1.6', marginBottom: '45px', fontWeight: '300', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>The all-in-one workspace for those who demand success. Join today and elevate your business.</p>
                </div>

                <div style={{ flex: '0 0 440px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '45px', boxShadow: '0 40px 60px -12px rgba(0, 0, 0, 0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a202c', margin: 0, letterSpacing: '-0.5px' }}>Get Started</h3>
                        <p style={{ color: '#718096', marginTop: '8px', fontSize: '15px', fontStyle: 'italic' }}>And never stop.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" style={inputStyle} required />
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" style={inputStyle} required />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" style={inputStyle} required />
                        
                        {/* REPAIR: Professional Toggle Container */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    placeholder="Password" 
                                    style={{ ...inputStyle, paddingRight: '55px' }} 
                                    required 
                                />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    placeholder="Confirm" 
                                    style={inputStyle} 
                                    required 
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '115px', // Adjusted to sit inside the first password field
                                    top: '14px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: orangeBase,
                                    textTransform: 'uppercase',
                                    zIndex: 5
                                }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {message && (
                            <div style={{ padding: '12px', marginBottom: '15px', borderRadius: '6px', backgroundColor: isSuccess ? '#f0fff4' : '#fff5f5', color: isSuccess ? '#2f855a' : '#c53030', border: `1px solid ${isSuccess ? '#9ae6b4' : '#feb2b2'}`, fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                                {message}
                            </div>
                        )}

                        <button type="submit" 
                            style={{ 
                                width: '100%', padding: '16px', backgroundColor: isSubmitHover ? orangeHover : orangeBase, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '10px', transition: 'all 0.2s',
                                boxShadow: isSubmitHover ? `0 10px 20px -5px rgba(255, 87, 34, 0.5)` : `0 4px 10px -2px rgba(255, 87, 34, 0.3)`,
                                transform: isSubmitHover ? 'translateY(-2px)' : 'translateY(0)'
                            }}
                            onMouseEnter={() => setIsSubmitHover(true)} onMouseLeave={() => setIsSubmitHover(false)}
                        >
                            Create Account
                        </button>
                    </form>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #edf2f7', fontSize: '14px', gap: '15px', color: '#cbd5e0' }}>
                        <a href="/login" style={{ color: orangeBase, textDecoration: 'none', fontWeight: '600' }}>Sign In</a>
                        <span>|</span>
                        <a href="/login-assistance" style={{ color: '#718096', textDecoration: 'none' }}>Login Assistance</a>
                        <span>|</span>
                        <a href="/demo" style={{ color: '#718096', textDecoration: 'none' }}>Request a demo</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;