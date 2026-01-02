import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#ffffff', 
      borderTop: '1px solid #e5e7eb', 
      padding: '40px 0',
      marginTop: '60px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
        
        {/* Uniform Logo Text matching Header */}
        <div style={{ marginBottom: '24px' }}>
           <span style={{ fontWeight: '900', color: '#d94d11', fontSize: '22px', letterSpacing: '-0.5px' }}>
             YouTool
           </span>
        </div>

        {/* Clean Nav Links */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '24px', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <Link to="/security" style={linkStyle}>Security</Link>
          <Link to="/privacy" style={linkStyle}>Privacy</Link>
          <Link to="/terms" style={linkStyle}>Terms of Service</Link>
          <Link to="/compliance" style={linkStyle}>Compliance</Link>
        </div>

        {/* Copyright notice */}
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          © 2024–2026 YouTool Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const linkStyle = {
  textDecoration: 'none',
  color: '#4b5563',
  fontWeight: '500'
};

export default Footer;