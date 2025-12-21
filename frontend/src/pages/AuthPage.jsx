import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../Login'; // Importing your existing Login component

const AuthPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if the URL is '/register'
    const isRegisterMode = location.pathname === '/register';

    return (
        <Login 
            onLoginSuccess={(user) => {
                onLoginSuccess(user);
                navigate('/dashboard'); // Redirect to dashboard after success
            }}
            initialMode={isRegisterMode ? 'register' : 'login'}
            onBack={() => navigate('/')} // Back button goes to Home
        />
    );
};

export default AuthPage;