import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

const PublicLayout = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#1f2937',
            overflowX: 'hidden'
        }}>
            <style>{`
                * { box-sizing: border-box; }
                
                /* --- THE NO-JUMP FIX --- */
                html { 
                    overflow-y: scroll; /* Always show scrollbar track */
                }
                
                body { margin: 0; padding: 0; }
            `}</style>
            
            {/* Master Header */}
            <PublicNavbar />

            {/* Page Content */}
            <Outlet />
        </div>
    );
};

export default PublicLayout;