const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (user) => {
    // Includes role and companyId for full access
    return jwt.sign({ 
        id: user.id, 
        email: user.email,
        role: user.role,
        companyId: user.companyId
    }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Initiate Social Login
exports.socialLogin = (provider) => {
    let scope;

    // 1. Define specific permissions for each platform
    if (provider === 'facebook') {
        scope = ['public_profile', 'email'];
    } else if (provider === 'microsoft') {
        // 🚀 FIX: Microsoft requires 'openid' to allow login
        // We also add 'user.read' to ensure we can fetch the name/email
        scope = ['openid', 'profile', 'email', 'user.read'];
    } else {
        // Default for Google and others
        scope = ['profile', 'email'];
    }

    return passport.authenticate(provider, { scope });
};

// Handle Provider Callback
exports.socialCallback = (provider) => {
    return (req, res, next) => {
        passport.authenticate(provider, { session: false }, (err, user, info) => {
            if (err || !user) {
                // Redirect to login with error if something fails
                return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
            }

            // Generate Token
            const token = generateToken(user);
            
            // Redirect to frontend (App.jsx will handle the rest)
            res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
        })(req, res, next);
    };
};