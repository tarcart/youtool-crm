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
    const [message, setMessage] = useState('');
    const [bgImage, setBgImage] = useState('');

    // Daily Rotating Background Logic (Keeps the vibe consistent with Login)
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage('❌ Passwords do not match');
            return;
        }

        try {
            // Assuming your backend has this route. If not, we will build it next.
            const response = await axios.post('/api/auth/register', {
                name: formData.name,
                companyName: formData.companyName,
                email: formData.email,
                password: formData.password
            });
            setMessage('✅ Account created! Redirecting to login...');
            setTimeout(() => window.location.href = '/', 2000);
        } catch (error) {
            setMessage('❌ Registration failed. Try a different email.');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            
            {/* LEFT SIDE: Dynamic Background */}
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
                <a href="/" style={{ textDecoration: 'none', color: 'white', display: 'inline-block', width: 'fit-content' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }}>YouTool</h1>
                </a>
                <p style={{ fontSize: '1.2rem', maxWidth: '500px', lineHeight: '1.6' }}>
                    Join thousands of businesses organizing their work with YouTool.
                </p>
            </div>

            {/* RIGHT SIDE: Registration Form */}
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
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>Create Account</h2>
                    <p style={{ color: '#777', marginBottom: '25px' }}>Start your 14-day free trial.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* Name Field */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Full Name</label>
                            <input type="text" name="name" onChange={handleChange} required
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>

                        {/* Company Field */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Company Name</label>
                            <input type="text" name="companyName" onChange={handleChange} required
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Work Email</label>
                            <input type="email" name="email" onChange={handleChange} required
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>

                        {/* Password Fields */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Password</label>
                                <input type="password" name="password" onChange={handleChange} required
                                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Confirm</label>
                                <input type="password" name="confirmPassword" onChange={handleChange} required
                                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        <button type="submit" style={{ 
                            width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', 
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' 
                        }}>
                            Get Started
                        </button>
                    </form>

                    {message && (
                        <p style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', textAlign: 'center', backgroundColor: message.includes('✅') ? '#e6fffa' : '#fff5f5', color: message.includes('✅') ? '#2c7a7b' : '#c53030', border: '1px solid currentColor' }}>
                            {message}
                        </p>
                    )}

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <p style={{ color: '#666' }}>
                            Already have an account? <a href="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;