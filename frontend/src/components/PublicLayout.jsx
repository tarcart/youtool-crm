import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

const PublicLayout = () => {
    return (
        <div className="public-wrapper">
            {/* 1. Header stays at the top, naturally */}
            <PublicNavbar />

            {/* 2. Main content area */}
            <div className="main-content">
                <Outlet />
            </div>

            {/* 3. Footer simply follows the content */}
            <Footer />
        </div>
    );
};

export default PublicLayout;