import React from 'react';
import { Link } from 'react-router-dom';

const SolutionsPage = () => {
    return (
        <div className="page-container">
            <style>{`
                /* ANIMATION */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .page-container {
                    /* Removed fixed height to play nice with Layout, 
                       but kept content tight to avoid scrollbar */
                    background-color: #ffffff;
                    font-family: 'Inter', system-ui, sans-serif;
                    color: #1f2937;
                    overflow-x: hidden;
                }
                
                /* --- HEADER (Tightened) --- */
                .header-section {
                    text-align: center;
                    padding: 30px 20px 20px; /* Reduced from 40px to 30px */
                    max-width: 900px;
                    margin: 0 auto;
                    animation: fadeUp 0.6s ease-out;
                    position: relative;
                    z-index: 2;
                }
                .page-title { 
                    font-size: 48px; 
                    font-weight: 800; 
                    margin-bottom: 10px; /* Reduced margin */
                    letter-spacing: -1.5px; 
                    line-height: 1.1;
                    color: #111827;
                }
                .divider {
                    width: 60px;
                    height: 4px;
                    background: #d94d11;
                    margin: 0 auto 15px auto; /* Reduced margin */
                    border-radius: 2px;
                }
                .page-subtitle { 
                    font-size: 18px; 
                    color: #4b5563; 
                    line-height: 1.5;
                    font-weight: 400;
                    max-width: 700px; 
                    margin: 0 auto;
                }

                /* --- SECTION BACKGROUND --- */
                .grid-background {
                    background-color: #ffffff;
                    background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 24px 24px;
                    padding-bottom: 20px; /* Reduced padding */
                    min-height: 60vh;
                }

                /* --- GRID LAYOUT (Compact) --- */
                .solutions-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr; 
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0 40px;
                    gap: 40px; /* Reduced gap from 50px */
                    animation: fadeUp 0.8s ease-out;
                    position: relative;
                    z-index: 2;
                }

                /* COLUMN HEADERS */
                .column-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 10px;
                }
                .header-tag {
                    background: #1f2937;
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 3px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .header-text {
                    font-size: 13px;
                    font-weight: 700;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* --- PREMIUM CARDS (Compact) --- */
                .btn-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
                
                .solution-card {
                    display: flex;
                    align-items: center;
                    padding: 10px 16px; /* Slightly slimmer cards */
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    position: relative;
                    overflow: hidden;
                }

                /* HOVER EFFECTS */
                .solution-card:hover {
                    border-color: #d94d11;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px -6px rgba(217, 77, 17, 0.15);
                }

                /* ICON STYLES */
                .icon-box {
                    width: 36px;
                    height: 36px;
                    background: #fff7ed;
                    color: #d94d11;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    margin-right: 15px;
                    transition: all 0.25s ease;
                }
                .solution-card:hover .icon-box {
                    background: #d94d11;
                    color: white;
                    transform: scale(1.1);
                }

                /* TEXT STYLES */
                .card-content { flex: 1; }
                .card-title { font-weight: 700; color: #111827; font-size: 15px; margin-bottom: 0px; }
                .card-desc { font-size: 11px; color: #9ca3af; font-weight: 500; }
                
                .card-arrow { 
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #f3f4f6;
                    color: #9ca3af;
                    font-size: 12px;
                    transition: all 0.25s ease;
                }
                .solution-card:hover .card-arrow {
                    background: #d94d11;
                    color: white;
                    transform: translateX(3px);
                }

                @media (max-width: 1024px) {
                    .nav-links { display: none; }
                }

                @media (max-width: 768px) {
                    .solutions-grid { grid-template-columns: 1fr; gap: 30px; }
                    .page-title { font-size: 32px; }
                    .header-section { padding-top: 30px; }
                }
            `}</style>

            {/* HEADER */}
            <div className="header-section">
                <h1 className="page-title">One Platform. <br/>Endless Solutions.</h1>
                <div className="divider"></div>
                <p className="page-subtitle">
                    Whether you are managing a property portfolio or scaling a tech startup, 
                    YouTool adapts to your unique workflow.
                </p>
            </div>

            {/* BACKGROUND WRAPPER FOR DOT PATTERN */}
            <div className="grid-background">
                <div className="solutions-grid">
                    
                    {/* LEFT COLUMN */}
                    <div className="grid-column">
                        <div className="column-header">
                            <span className="header-tag">USES</span>
                            <span className="header-text">By Department</span>
                        </div>
                        <div className="btn-grid">
                            <PremiumCard icon="📈" title="Sales" desc="Pipelines & Forecasting" />
                            <PremiumCard icon="👥" title="Management" desc="Admin & Oversight" />
                            <PremiumCard icon="⚙️" title="Operations" desc="Workflow Automation" />
                            <PremiumCard icon="📦" title="Product" desc="Roadmapping & Launch" />
                            <PremiumCard icon="📣" title="Marketing" desc="Campaigns & Leads" />
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="grid-column">
                        <div className="column-header">
                            <span className="header-tag">SECTORS</span>
                            <span className="header-text">By Industry</span>
                        </div>
                        <div className="btn-grid">
                            <PremiumCard icon="🏠" title="Real Estate" desc="Property Management" />
                            <PremiumCard icon="💻" title="Tech" desc="SaaS & Development" />
                            <PremiumCard icon="💰" title="Finance" desc="Wealth & Assets" />
                            <PremiumCard icon="🚢" title="Trade Sector" desc="Logistics & Supply" />
                            <PremiumCard icon="⚖️" title="Professional Services" desc="Legal & Consulting" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Premium Card Component
const PremiumCard = ({ icon, title, desc }) => (
    <div className="solution-card" onClick={() => {}}>
        <div className="icon-box">{icon}</div>
        <div className="card-content">
            <div className="card-title">{title}</div>
            <div className="card-desc">{desc}</div>
        </div>
        <div className="card-arrow">➜</div>
    </div>
);

export default SolutionsPage;