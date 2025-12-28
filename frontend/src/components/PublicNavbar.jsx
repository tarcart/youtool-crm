import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
    return (
        <>
            <style>{`
                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    position: sticky;
                    top: 0;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    z-index: 100;
                    border-bottom: 1px solid #f3f4f6;
                }
                .logo {
                    font-size: 26px;
                    font-weight: 900;
                    color: #d94d11;
                    text-decoration: none;
                    letter-spacing: -0.5px;
                    display: inline-block;
                    transition: transform 0.2s ease, text-shadow 0.2s ease;
                }
                .logo:hover {
                    transform: scale(1.05);
                    text-shadow: 0 4px 15px rgba(217, 77, 17, 0.3);
                }
                .nav-links { display: flex; gap: 30px; }
                .nav-item {
                    text-decoration: none;
                    color: #4b5563;
                    font-weight: 600;
                    font-size: 15px;
                    transition: color 0.2s;
                    cursor: pointer;
                }
                .nav-item:hover { color: #d94d11; }
                
                .auth-buttons { display: flex; gap: 15px; align-items: center; }
                .btn-login { text-decoration: none; color: #4b5563; font-weight: 700; font-size: 15px; }
                .btn-login:hover { color: #111827; }

                .btn-register {
                    text-decoration: none;
                    background-color: #d94d11;
                    color: white;
                    padding: 10px 24px;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 15px;
                    transition: all 0.2s ease;
                }
                .btn-register:hover {
                    background-color: #c2410c;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(217, 77, 17, 0.25);
                }

                @media (max-width: 1024px) {
                    .nav-links { display: none; }
                }
            `}</style>

            <nav className="navbar">
                <Link to="/" className="logo">YouTool</Link>
                <div className="nav-links">
                    <Link to="/solutions" className="nav-item">Solutions</Link>
                    <Link to="/pricing" className="nav-item">Pricing</Link>
                    <Link to="/features" className="nav-item">Features</Link>
                    <Link to="/contact" className="nav-item">Contact</Link>
                </div>
                <div className="auth-buttons">
                    <Link to="/login" className="btn-login">Sign In</Link>
                    <Link to="/register" className="btn-register">Try YouTool for Free</Link>
                </div>
            </nav>
        </>
    );
};

export default PublicNavbar;