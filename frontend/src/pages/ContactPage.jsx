import React from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    return (
        <div className="page-container">
            <style>{`
                /* ANIMATION */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* BASE */
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; }

                .page-container {
                    min-height: 100vh;
                    background-color: #ffffff;
                    font-family: 'Inter', system-ui, sans-serif;
                    color: #1f2937;
                    overflow-x: hidden;
                }
                
                /* --- HEADER --- */
                .header-section {
                    text-align: center;
                    padding: 60px 20px 40px;
                    max-width: 800px;
                    margin: 0 auto;
                    animation: fadeUp 0.6s ease-out;
                }
                .page-title { font-size: 48px; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px; color: #111827; line-height: 1.1; }
                .page-subtitle { font-size: 18px; color: #6b7280; line-height: 1.5; }

                /* --- CONTACT GRID --- */
                .contact-wrapper {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr; /* Form is slightly wider */
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 40px 100px;
                    gap: 60px;
                    animation: fadeUp 0.8s ease-out;
                }

                /* LEFT SIDE: INFO CARDS */
                .info-stack { display: flex; flex-direction: column; gap: 20px; }
                
                .info-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 24px;
                    transition: all 0.2s ease;
                }
                .info-card:hover { border-color: #d94d11; transform: translateX(5px); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                
                .icon-circle {
                    width: 40px; height: 40px;
                    background: #fff7ed; color: #d94d11;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; margin-bottom: 15px;
                }
                .card-label { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 5px; }
                .card-value { font-size: 16px; color: #4b5563; }
                .card-link { color: #d94d11; text-decoration: none; font-weight: 600; }

                /* RIGHT SIDE: FORM */
                .form-box {
                    background: #f9fafb;
                    padding: 40px;
                    border-radius: 16px;
                    border: 1px solid #f3f4f6;
                }
                .form-group { margin-bottom: 20px; }
                .form-label { display: block; font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 8px; }
                .form-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 15px;
                    transition: border 0.2s;
                    font-family: inherit;
                }
                .form-input:focus { outline: none; border-color: #d94d11; box-shadow: 0 0 0 3px rgba(217, 77, 17, 0.1); }
                
                .btn-submit {
                    width: 100%;
                    background: #111827; /* Dark Button */
                    color: white;
                    padding: 14px;
                    border: none;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .btn-submit:hover { background: #d94d11; }

                @media (max-width: 900px) {
                    .contact-wrapper { grid-template-columns: 1fr; gap: 40px; }
                }
            `}</style>

            {/* HEADER */}
            <div className="header-section">
                <h1 className="page-title">Get in touch</h1>
                <p className="page-subtitle">We would love to hear from you. Our team is always here to assist.</p>
            </div>

            {/* CONTENT */}
            <div className="contact-wrapper">
                
                {/* LEFT: CARDS */}
                <div className="info-stack">
                    <div className="info-card">
                        <div className="icon-circle">✉️</div>
                        <div className="card-label">Sales Inquiry</div>
                        <div className="card-value">sales@youtool.com</div>
                    </div>

                    <div className="info-card">
                        <div className="icon-circle">🛠</div>
                        <div className="card-label">Technical Support</div>
                        <div className="card-value">support@youtool.com</div>
                    </div>

                    {/* ADDRESS CARD REMOVED */}
                </div>

                {/* RIGHT: FORM */}
                <div className="form-box">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-input" placeholder="Your name" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" placeholder="you@company.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea className="form-input" rows="4" placeholder="How can we help?"></textarea>
                    </div>
                    <button className="btn-submit" onClick={() => alert("Message sent! We'll be in touch.")}>Send Message</button>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;