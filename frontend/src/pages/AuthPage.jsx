import React, { useEffect } from 'react'; 
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Login from '../Login'; 

const AuthPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams(); // Hook to read ?token=...
    
    const isRegisterMode = location.pathname === '/register';

    // 🔗 INTERCEPTOR FOR SOCIAL LOGIN
    useEffect(() => {
        const token = searchParams.get('token');
        const userDataStr = searchParams.get('user');

        if (token && userDataStr) {
            try {
                // 1. Decode and parse the user data
                const userData = JSON.parse(decodeURIComponent(userDataStr));

                // 2. Save to localStorage to persist the session
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // 3. Update the app state
                onLoginSuccess(userData);

                // 4. Send the user to the dashboard
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