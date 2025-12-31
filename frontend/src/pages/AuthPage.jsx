import React, { useEffect } from 'react'; 
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Login from '../Login'; 

const AuthPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // 1. Get the data from the URL
        const token = searchParams.get('token');
        const userDataStr = searchParams.get('user');

        if (token && userDataStr) {
            try {
                // 2. Parse and Save
                const userData = JSON.parse(decodeURIComponent(userDataStr));
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // 3. Trigger the success state
                onLoginSuccess(userData);

                // 4. Clean the URL and redirect to dashboard
                // This removes the #_=_ and the long token from the address bar
                navigate('/dashboard', { replace: true });
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
            initialMode={window.location.pathname === '/register' ? 'register' : 'login'}
            onBack={() => navigate('/')} 
        />
    );
};

export default AuthPage;