import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-container">
            <style>{`
                .home-container { min-height: 100vh; background-color: #ffffff; color: #1f2937; overflow-x: hidden; }
                .hero-section { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 60px; max-width: 1400px; margin: 0 auto; padding: 80px 40px; min-height: 85vh; }
                .hero-content { max-width: 600px; }
                .hero-badge { display: inline-block; background-color: #fff7ed; color: #d94d11; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 20px; margin-bottom: 24px; border: 1px solid #ffedd5; text-transform: uppercase; letter-spacing: 0.5px; }
                .headline { font-size: 56px; line-height: 1.1; font-weight: 800; color: #111827; margin-bottom: 24px; }
                .subheadline { font-size: 20px; line-height: 1.6; color: #6b7280; margin-bottom: 40px; }
                .hero-cta-group { display: flex; gap: 16px; }
                .btn-hero-primary { text-decoration: none; background-color: #d94d11; color: white; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 18px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                .btn-hero-primary:hover { background-color: #c2410c; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(217, 77, 17, 0.3); }
                .btn-hero-secondary { background-color: white; color: #374151; border: 2px solid #e5e7eb; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 18px; cursor: pointer; transition: all 0.2s; }
                .btn-hero-secondary:hover { border-color: #d1d5db; background-color: #f9fafb; color: #111827; }
                .hero-visual { position: relative; }
                .blob { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(254, 215, 170, 0.4) 0%, rgba(255, 255, 255, 0) 70%); top: -50px; right: -50px; z-index: -1; border-radius: 50%; }
                .mock-window { background: white; border-radius: 16px; box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.15); border: 1px solid #e5e7eb; overflow: hidden; width: 100%; max-width: 600px; aspect-ratio: 16/10; display: flex; flex-direction: column; }
                .mock-header { height: 40px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; padding: 0 16px; gap: 8px; }
                .dot { width: 10px; height: 10px; border-radius: 50%; }
                .dot.red { background: #fca5a5; }
                .dot.yellow { background: #fcd34d; }
                .dot.green { background: #86efac; }
                .mock-body { flex: 1; display: flex; }
                .mock-sidebar { width: 140px; background: #fff; border-right: 1px solid #f3f4f6; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
                .mock-sidebar-item { height: 8px; background: #f3f4f6; border-radius: 4px; width: 80%; }
                .mock-sidebar-item.active { background: #fdba74; width: 100%; }
                .mock-main { flex: 1; padding: 24px; background: #ffffff; }
                .feature-highlight-box { background: #fff7ed; border: 2px solid #d94d11; border-radius: 8px; padding: 16px; margin-top: -20px; margin-left: 20px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: absolute; bottom: 40px; left: -40px; width: 280px; animation: float 4s ease-in-out infinite; }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
                .feature-title { font-weight: 800; color: #d94d11; font-size: 14px; margin-bottom: 4px; text-transform: uppercase; }
                .feature-desc { font-size: 13px; color: #4b5563; line-height: 1.4; }
                @media (max-width: 1024px) { .hero-section { grid-template-columns: 1fr; text-align: center; } .hero-cta-group { justify-content: center; } .hero-content { margin: 0 auto; } .mock-window { margin: 40px auto; } }
            `}</style>
            <main className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">New Feature Alert</span>
                    <h1 className="headline">The Premier CRM for <span style={{color:'#d94d11'}}>Growth.</span></h1>
                    <p className="subheadline">The only platform designed for <b>new companies</b>, <b>growing startups</b>, and <b>established enterprises</b> to scale together.</p>
                    <div className="hero-cta-group">
                        <Link to="/register" className="btn-hero-primary">Try YouTool for Free</Link>
                        <button onClick={() => alert("Demo coming soon")} className="btn-hero-secondary">Get a Demo</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="blob"></div>
                    <div className="mock-window">
                        <div className="mock-header"><div className="dot red"></div><div className="dot yellow"></div><div className="dot green"></div></div>
                        <div className="mock-body">
                            <div className="mock-sidebar"><div className="mock-sidebar-item active"></div><div className="mock-sidebar-item"></div><div className="mock-sidebar-item"></div><div className="mock-sidebar-item"></div></div>
                            <div className="mock-main"><div style={{display:'flex', gap:'10px', marginBottom:'20px'}}><div style={{flex:1, height:'80px', background:'#f3f4f6', borderRadius:'8px'}}></div><div style={{flex:1, height:'80px', background:'#f3f4f6', borderRadius:'8px'}}></div></div><div style={{width:'100%', height:'150px', background:'#f9fafb', borderRadius:'8px', border:'1px dashed #e5e7eb'}}></div></div>
                        </div>
                    </div>
                    <div className="feature-highlight-box">
                        <div className="feature-title">⚡ Multi-Entity Support</div>
                        <div className="feature-desc">The <b>ONLY CRM</b> where you can run multiple companies from one single account at <b>NO ADDITIONAL COST</b>.</div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default HomePage;