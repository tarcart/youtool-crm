import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
    return (
        <div className="page-container">
            <style>{`
                /* ANIMATION */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* PAGE CONTAINER */
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
                    padding: 60px 20px 50px;
                    max-width: 900px;
                    margin: 0 auto;
                    animation: fadeUp 0.6s ease-out;
                }
                .page-title { font-size: 48px; font-weight: 800; margin-bottom: 20px; letter-spacing: -1px; color: #111827; line-height: 1.1; }
                .page-subtitle { font-size: 18px; color: #6b7280; line-height: 1.5; font-weight: 400; max-width: 700px; margin: 0 auto; }

                /* --- BENTO GRID --- */
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-auto-rows: minmax(250px, auto);
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 40px 100px;
                    gap: 24px;
                    animation: fadeUp 0.8s ease-out;
                }

                /* GRID ITEMS */
                .feature-box {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .feature-box:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
                    border-color: #fed7aa;
                }
                
                /* SPECIAL SIZES */
                .box-large { grid-column: span 2; background: white; border-color: #d94d11; } /* Highlight Box */
                .box-tall { grid-row: span 2; background: #fff7ed; border: none; } /* Orange Tint Box */

                /* CONTENT STYLING */
                .f-icon { font-size: 32px; margin-bottom: 20px; display: inline-block; }
                .f-title { font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 12px; }
                .f-desc { font-size: 15px; color: #6b7280; line-height: 1.6; }
                
                .highlight-badge {
                    background: #d94d11; color: white;
                    font-size: 11px; font-weight: 700;
                    padding: 4px 10px; border-radius: 20px;
                    margin-bottom: 15px; display: inline-block;
                    text-transform: uppercase;
                }

                @media (max-width: 1024px) {
                    .features-grid { grid-template-columns: 1fr; }
                    .box-large, .box-tall { grid-column: auto; grid-row: auto; }
                }
            `}</style>

            {/* HEADER */}
            <div className="header-section">
                <h1 className="page-title">Powerfully Simple.</h1>
                <p className="page-subtitle">
                    We stripped away the clutter of traditional CRMs to give you exactly what you need to manage relationships, close deals, and deliver projects.
                </p>
            </div>

            {/* FEATURES BENTO GRID */}
            <div className="features-grid">
                
                {/* 1. Multi-Entity (The USP - Large Box) */}
                <div className="feature-box box-large">
                    <span className="highlight-badge">Exclusive Feature</span>
                    <div className="f-title">Multi-Entity Architecture</div>
                    <div className="f-desc">
                        Stop switching accounts. YouTool is the only platform built to run <b>multiple companies</b> from a single dashboard. 
                        Keep data separate but accessible under one login. Perfect for serial entrepreneurs and holding companies.
                    </div>
                </div>

                {/* 2. Visual Pipelines */}
                <div className="feature-box">
                    <div className="f-icon">📊</div>
                    <div className="f-title">Visual Sales Pipelines</div>
                    <div className="f-desc">
                        Track every opportunity from "Lead" to "Closed Won." Customizable stages let you adapt the workflow to Real Estate, Tech Sales, or Consulting.
                    </div>
                </div>

                {/* 3. Team Collaboration (The Tall Box) */}
                <div className="feature-box box-tall">
                    <div className="f-icon">🤝</div>
                    <div className="f-title">Team Assignment & Collaboration</div>
                    <div className="f-desc">
                        <p>Work is better together. Assign Leads, Opportunities, and Tasks to specific team members.</p>
                        <br/>
                        <p><b>Coming Soon:</b></p>
                        <ul style={{paddingLeft:'20px', margin:0, fontSize:'14px', color:'#d94d11'}}>
                            <li>@Mentions</li>
                            <li>Activity Feeds</li>
                            <li>User Permissions</li>
                        </ul>
                    </div>
                </div>

                {/* 4. Unified Database */}
                <div className="feature-box">
                    <div className="f-icon">🗂</div>
                    <div className="f-title">Unified Contact Database</div>
                    <div className="f-desc">
                        A clean, 360-degree view of your network. Link Contacts to Organizations instantly. Search millions of records in milliseconds with our optimized backend.
                    </div>
                </div>

                {/* 5. Integrated Projects */}
                <div className="feature-box">
                    <div className="f-icon">✅</div>
                    <div className="f-title">Integrated Project Management</div>
                    <div className="f-desc">
                        Don't let the deal stop at the sale. Convert Opportunities directly into Projects with associated Tasks. Manage the entire lifecycle in one app.
                    </div>
                </div>

                {/* 6. Security */}
                <div className="feature-box box-large" style={{background:'#1f2937', borderColor:'#374151'}}>
                    <div className="f-title" style={{color:'white'}}>Enterprise-Grade Control</div>
                    <div className="f-desc" style={{color:'#9ca3af'}}>
                        Built with a "God Mode" Super Admin architecture. You have total control over user access, data visibility, and system settings. 
                        Your data is yours, secure and encrypted.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;