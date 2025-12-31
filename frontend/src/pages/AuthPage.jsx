import React, { useEffect } from 'react'; 
import { useNavigate, useSearchParams } from 'react-router-dom';
import Login from '../Login'; 

const AuthPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // 1. Grab the token and user data from the URL
        const token = searchParams.get('token');
        const userDataStr = searchParams.get('user');

        if (token && userDataStr) {
            console.log("🔗 Social handshake detected in URL...");
            try {
                // 2. Parse the data
                const userData = JSON.parse(decodeURIComponent(userDataStr));

                // 3. Save to localStorage so the session sticks
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // 4. Update the app's logged-in state
                onLoginSuccess(userData);

                // 5. Hard redirect to dashboard and clear the URL
                // We use replace: true to prevent the 'back' button from returning here
                navigate('/dashboard', { replace: true });
            } catch (err) {
                console.error("❌ Handshake error:", err);
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