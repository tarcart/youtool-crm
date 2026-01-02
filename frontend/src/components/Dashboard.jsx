import React from 'react';

const Dashboard = () => (
    <div style={{ padding: '25px', backgroundColor: '#f3f4f6', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="dash-card-hover" style={card}>
                <h4 style={cardTitle}>Top Sales Reps</h4>
                <div style={valText}>$4.12K Avg</div>
            </div>
            <div className="dash-card-hover" style={card}>
                <h4 style={cardTitle}>Sales Pipeline Funnel</h4>
                <div style={valText}>$0.00 Value</div>
            </div>
            <div className="dash-card-hover" style={{ ...card, gridColumn: 'span 2', gridRow: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h4 style={cardTitle}>Total Sales</h4>
                <div style={gaugeBox}>
                    <div style={gaugeArc}></div>
                    <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '20px', color: '#333' }}>$2.39M</div>
                </div>
            </div>
            <div className="dash-card-hover" style={card}>
                <h4 style={cardTitle}>Win Rate</h4>
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#10b981', marginTop: '15px' }}>20.54%</div>
            </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
            .dash-card-hover { transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
            .dash-card-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
        `}} />
    </div>
);

const card = { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e1e6eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const cardTitle = { margin: '0 0 15px 0', fontSize: '14px', color: '#666', fontWeight: '600' };
const valText = { fontSize: '32px', fontWeight: 'bold', color: '#d94d11', marginTop: '15px' };
const gaugeBox = { width: '220px', height: '110px', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const gaugeArc = { width: '220px', height: '110px', border: '18px solid #e1e6eb', borderBottom: 'none', borderTopLeftRadius: '110px', borderTopRightRadius: '110px' };

export default Dashboard;