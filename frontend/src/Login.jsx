import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    // Pre-filled with your test user for convenience
    const [email, setEmail] = useState('admin@techcorp.com');
    const [password, setPassword] = useState('SecurePassword123');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This hits the login route you just finished in the backend
            const response = await axios.post('http://localhost:5001/api/auth/login', {
    email,
    password
});
            
            // Store the JWT token in the browser so you stay logged in
            localStorage.setItem('token', response.data.token);
            setMessage(`✅ Success! Welcome to ${response.data.user.companyName}`);
            
            // Pass the user data back to the main App
            if (onLoginSuccess) onLoginSuccess(response.data.user);
        } catch (error) {
            setMessage('❌ Login failed. Check your credentials.');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>CRM Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} 
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} 
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                    Sign In
                </button>
            </form>
            {message && <p style={{ marginTop: '20px', textAlign: 'center', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default Login;