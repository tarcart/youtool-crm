import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
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
                    padding: 40px 20px 40px;
                    max-width: 900px;
                    margin: 0 auto;
                    animation: fadeUp 0.6s ease-out;
                }
                .page-title { 
                    font-size: 48px; 
                    font-weight: 800; 
                    margin-bottom: 15px; 
                    letter-spacing: -1px; 
                    line-height: 1.1;
                    color: #111827;
                }
                .page-subtitle { 
                    font-size: 18px; 
                    color: #6b7280; 
                    line-height: 1.5;
                    font-weight: 400;
                    max-width: 600px; 
                    margin: 0 auto 30px auto;
                }

                /* --- NEW STANDARD AD BOX --- */
                .ad-box {
                    background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
                    border: 1px solid #fed7aa;
                    border-left: 4px solid #d94d11;
                    padding: 20px 30px;
                    border-radius: 8px;
                    max-width: 600px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    text-align: left;
                    box-shadow: 0 4px 15px rgba(217, 77, 17, 0.05);
                }
                .ad-icon {
                    font-size: 24px;
                    background: white;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    border: 1px solid #fed7aa;
                    color: #d94d11;
                }
                .ad-content h3 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: #111827;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .ad-content p {
                    margin: 0;
                    font-size: 14px;
                    color: #4b5563;
                    line-height: 1.4;
                }
                .highlight { color: #d94d11; font-weight: 700; }

                /* --- PRICING GRID --- */
                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 40px 100px;
                    gap: 30px;
                    animation: fadeUp 0.8s ease-out;
                }

                /* --- CARD STYLES --- */
                .pricing-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .pricing-card:hover {
                    border-color: #d94d11;
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
                }

                /* Featured Card Style */
                .card-featured {
                    border: 2px solid #d94d11;
                    background: #fff7ed;
                    transform: scale(1.05);
                    z-index: 10;
                    box-shadow: 0 25px 50px -12px rgba(217, 77, 17, 0.15);
                }
                .card-featured:hover { transform: scale(1.05) translateY(-8px); }
                
                .badge-featured {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #d94d11;
                    color: white;
                    font-size: 11px;
                    font-weight: 800;
                    padding: 4px 12px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* Card Content */
                .plan-name { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 10px; }
                .plan-price { font-size: 42px; font-weight: 900; color: #111827; letter-spacing: -1px; }
                .plan-period { font-size: 14px; color: #6b7280; font-weight: 500; }
                .plan-desc { font-size: 13px; color: #6b7280; margin: 15px 0 25px; line-height: 1.5; min-height: 40px; }

                .feature-list { list-style: none; padding: 0; margin: 0 0 30px 0; flex: 1; }
                .feature-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    font-size: 13px; 
                    color: #374151; 
                    margin-bottom: 12px; 
                    font-weight: 500;
                }
                .check-icon { color: #d94d11; font-weight: bold; }

                /* Buttons */
                .btn-plan {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                    text-decoration: none;
                    border: 1px solid #d94d11;
                }
                .btn-outline { background: white; color: #d94d11; }
                .btn-outline:hover { background: #fff7ed; }
                
                .btn-solid { background: #d94d11; color: white; border: none; }
                .btn-solid:hover { background: #c2410c; box-shadow: 0 4px 12px rgba(217, 77, 17, 0.3); }

                @media (max-width: 768px) {
                    .ad-box { flex-direction: column; text-align: center; }
                }
            `}</style>

            {/* HEADER */}
            <div className="header-section">
                <h1 className="page-title">Simple, transparent pricing.</h1>
                <p className="page-subtitle">
                    Whether you are a solo founder or a global enterprise, we have a plan that scales with you.
                </p>
                
                <div className="ad-box">
                    <div className="ad-icon">💎</div>
                    <div className="ad-content">
                        <h3>We are the new standard.</h3>
                        <p>
                            Price is flat. Whether <span className="highlight">yearly or monthly</span>, same price. 
                            Same Access. No hidden fees.
                        </p>
                    </div>
                </div>
            </div>

            {/* PRICING GRID */}
            <div className="pricing-grid">
                
                {/* TIER 1 */}
                <PricingCard 
                    name="Solo"
                    price="$10"
                    desc="For individuals just getting started."
                    users="1 User"
                    storage="100 GB"
                    btnStyle="outline"
                />

                {/* TIER 2 */}
                <PricingCard 
                    name="Micro Team"
                    price="$25"
                    desc="Perfect for small partnerships."
                    users="Up to 3 Users"
                    storage="400 GB"
                    btnStyle="outline"
                />

                {/* TIER 3 */}
                <PricingCard 
                    name="Small Business"
                    price="$50"
                    desc="Growing teams needing more space."
                    users="Up to 10 Users"
                    storage="600 GB"
                    btnStyle="outline"
                />

                {/* TIER 4 - FEATURED */}
                <PricingCard 
                    name="Growth"
                    price="$100"
                    desc="The best value for scaling companies."
                    users="Up to 100 Users"
                    storage="5 TB Storage"
                    btnStyle="solid"
                    isFeatured={true}
                />

                {/* TIER 5 */}
                <PricingCard 
                    name="Business"
                    price="$500"
                    desc="For established mid-sized organizations."
                    users="Up to 300 Users"
                    storage="15 TB Storage"
                    btnStyle="outline"
                />

                {/* TIER 6 */}
                <PricingCard 
                    name="Enterprise"
                    price="$999"
                    desc="Maximum power for large operations."
                    users="Up to 1000 Users"
                    storage="50 TB Storage"
                    btnStyle="outline"
                />

                {/* TIER 7 - CONTACT */}
                <div className="pricing-card" style={{borderColor: '#111827', background: '#111827', color: 'white'}}>
                    <div className="plan-name" style={{color: 'white'}}>Unlimited</div>
                    <div className="plan-price" style={{color: 'white', fontSize:'32px'}}>Custom</div>
                    <div className="plan-period" style={{color: '#9ca3af'}}>per month</div>
                    <div className="plan-desc" style={{color: '#d1d5db'}}>
                        Need more than 1000 users? Let's build a custom plan.
                    </div>
                    <ul className="feature-list">
                        <li className="feature-item" style={{color: '#e5e7eb'}}>
                            <span className="check-icon">✓</span> Unlimited Users
                        </li>
                        <li className="feature-item" style={{color: '#e5e7eb'}}>
                            <span className="check-icon">✓</span> Unlimited Storage
                        </li>
                        <li className="feature-item" style={{color: '#e5e7eb'}}>
                            <span className="check-icon">✓</span> Dedicated Support
                        </li>
                    </ul>
                    <Link to="/register" className="btn-plan" style={{background:'white', color:'black', border:'none'}}>Contact Sales</Link>
                </div>
            </div>
        </div>
    );
};

// Reusable Card Component
const PricingCard = ({ name, price, desc, users, storage, btnStyle, isFeatured }) => (
    <div className={`pricing-card ${isFeatured ? 'card-featured' : ''}`}>
        {isFeatured && <div className="badge-featured">Best Value</div>}
        <div className="plan-name">{name}</div>
        <div style={{display:'flex', alignItems:'baseline', gap:'4px'}}>
            <div className="plan-price">{price}</div>
            <div className="plan-period">/mo</div>
        </div>
        <div className="plan-desc">{desc}</div>
        
        <ul className="feature-list">
            <li className="feature-item"><span className="check-icon">✓</span> {users}</li>
            <li className="feature-item"><span className="check-icon">✓</span> {storage}</li>
            <li className="feature-item"><span className="check-icon">✓</span> Multi-Entity Support</li>
            <li className="feature-item"><span className="check-icon">✓</span> Full CRM Access</li>
        </ul>

        <Link to="/register" className={`btn-plan ${btnStyle === 'solid' ? 'btn-solid' : 'btn-outline'}`}>
            Get Started
        </Link>
    </div>
);

export default PricingPage;