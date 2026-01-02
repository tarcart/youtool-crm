import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('Verifying...');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus('❌ Invalid Link');
            setIsError(true);
            return;
        }

        axios.post('/api/auth/verify-email', { token })
            .then(() => {
                setStatus('✅ Email Verified! Redirecting...');
                setTimeout(() => navigate('/login'), 2000);
            })
            .catch((err) => {
                // Friendly error message
                setIsError(true);
                setStatus('⚠️ Link expired or Account already active.');
            });
    }, [token, navigate]);

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontFamily: '-apple-system, sans-serif',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: '#f9fafb'
        }}>
            <h2 style={{ 
                fontSize: '24px', 
                color: isError ? '#d97706' : '#16a34a', // Orange for warning, Green for success
                textAlign: 'center' 
            }}>
                {status}
            </h2>
            
            <p style={{ color: '#666', marginBottom: '10px' }}>
                {isError ? "If you have already verified, please log in below." : "Just a moment..."}
            </p>

            {isError && (
                 <button 
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#d94d11',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                 >
                    Go to Login
                 </button>
            )}
        </div>
    );
};

export default VerifyEmail;