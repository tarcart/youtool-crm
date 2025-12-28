import React, { useState } from 'react'; // Added useState
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../Login'; 

const AuthPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if the URL is '/register'
    const isRegisterMode = location.pathname === '/register';

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