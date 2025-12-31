import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import Login from '../Login'; 

const AuthPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams(); // Hook to read URL parameters
    
    // Check if the URL is '/register'
    const isRegisterMode = location.pathname === '/register';

    // 🔗 SOCIAL LOGIN HANDSHAKE
    // This effect runs on mount to check if we just returned from Google/FB/MS
    useEffect(() => {
        const token = searchParams.get('token');
        const userDataStr = searchParams.get('user');

        if (token && userDataStr) {
            try {
                // 1. Decode and parse the user data from the URL
                const userData = JSON.parse(decodeURIComponent(userDataStr));

                // 2. Save credentials to localStorage so the session persists
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // 3. Trigger the app-wide login success state
                onLoginSuccess(userData);

                // 4. Send the user to their dashboard
                navigate('/dashboard');
            } catch (err) {
                console.error("Social login parsing failed:", err);
            }
        }
    }, [searchParams, navigate, onLoginSuccess]);

    return (
        <Login 
            onLoginSuccess={(user) => {
                onLoginSuccess(user);
                navigate('/dashboard'); 
            }}
            initialMode={isRegisterMode ? 'register' : 'login'}
            onBack={() => navigate('/')} 
        />
    );
};

export default AuthPage;