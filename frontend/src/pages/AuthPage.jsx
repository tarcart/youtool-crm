import React, { useEffect } from 'react'; 
import { useNavigate, useSearchParams } from 'react-router-dom';
import Login from '../Login'; 

const AuthPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // 1. Triple-check: Get token from Router OR direct from the browser window
        const token = searchParams.get('token') || new URLSearchParams(window.location.search).get('token');
        const userDataStr = searchParams.get('user') || new URLSearchParams(window.location.search).get('user');

        if (token && userDataStr) {
            console.log("🛠️ SOCIAL HANDSHAKE DETECTED"); 
            try {
                // 2. Clear that annoying Facebook hash fragment immediately
                if (window.location.hash === '#_=_') {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }

                // 3. Save to localStorage
                const userData = JSON.parse(decodeURIComponent(userDataStr));
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // 4. Log in and Move to Dashboard
                onLoginSuccess(userData);
                
                // Use a short delay to ensure state is set before navigating
                setTimeout(() => navigate('/dashboard', { replace: true }), 100);
            } catch (err) {
                console.error("❌ Handshake Error:", err);
            }
        }
    }, [searchParams, navigate, onLoginSuccess]);

    return (
        <Login 
            onLoginSuccess={(user) => {
                onLoginSuccess(user);
                navigate('/dashboard'); 
            }}
            initialMode={window.location.pathname === '/register' ? 'register' : 'login'}
            onBack={() => navigate('/')} 
        />
    );
};

export default AuthPage;