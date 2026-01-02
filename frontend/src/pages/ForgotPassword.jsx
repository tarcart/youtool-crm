import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [bgImage, setBgImage] = useState('');
    const [isSubmitHover, setIsSubmitHover] = useState(false);

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
        setLoading(true);
        setMessage('');
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setMessage('✅ Check your email! We sent you a password reset link.');
            setEmail(''); 
        } catch (err) {
            setMessage('⚠️ ' + (err.response?.data?.error || 'Something went wrong.'));
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #d1d5da',
        fontSize: '15px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        marginBottom: '16px',
        outline: 'none'
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif', backgroundColor: 'white' }}>
            <div style={{ flex: '1.2', backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', color: 'white' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800' }}>YouTool</h1>
                </Link>
                <p style={{ fontSize: '1.5rem', opacity: 0.95 }}>Don't worry, we'll get you back up and running.</p>
            </div>
            <div style={{ flex: '0.8', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f8ff', color: '#0366d6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '24px' }}>🔒</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0366d6' }}>Forgot Password?</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} required />
                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: loading ? '#94d3a2' : '#0366d6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                    <div style={{ marginTop: '24px' }}>
                        <Link to="/signin" style={{ color: '#0366d6', textDecoration: 'none', fontWeight: '600' }}>← Back to Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;