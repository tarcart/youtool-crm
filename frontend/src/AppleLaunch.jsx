import React from 'react';

const AppleLaunch = () => {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1449034446853-66c86144b0ad")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '50px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '600px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1.5px' }}>
                    YouTool <span style={{ color: '#0366d6' }}>+</span> Apple
                </h1>
                
                <div style={{ fontSize: '4rem', marginBottom: '30px' }}></div>
                
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '15px' }}>
                    Coming Soon
                </h2>
                
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '40px' }}>
                    Login with Apple ID will be launched <br/>
                    <strong style={{ color: '#0366d6', fontSize: '1.4rem' }}>Q1, 2026</strong>
                </p>

                <button 
                    onClick={() => window.location.href = '/signin'}
                    style={{
                        padding: '12px 30px',
                        backgroundColor: '#0366d6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Back to Sign In
                </button>
            </div>
        </div>
    );
};

export default AppleLaunch;