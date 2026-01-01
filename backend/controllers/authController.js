const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT
const generateToken = (user) => {
    return jwt.sign({ 
        id: user.id, email: user.email, role: user.role, companyId: user.companyId
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// 1. Social Login Start
exports.socialLogin = (provider) => {
    let scope;
    if (provider === 'facebook') scope = ['public_profile', 'email'];
    else if (provider === 'microsoft') scope = ['openid', 'profile', 'email', 'user.read'];
    else if (provider === 'linkedin') scope = ['openid', 'profile', 'email'];
    else scope = ['profile', 'email'];

    // Force State FALSE to prevent session creation
    return passport.authenticate(provider, { scope, state: false });
};

// 2. Social Callback (The Fix)
exports.socialCallback = (provider) => {
    return (req, res, next) => {
        // 🔨 SLEDGEHAMMER FIX:
        // If LinkedIn sends a 'state' parameter, delete it so Passport doesn't look for a session.
        if (req.query && req.query.state) {
            delete req.query.state; 
        }

        passport.authenticate(provider, { session: false, state: false }, (err, user, info) => {
            if (err || !user) {
                console.error(`[Auth Failed] ${provider}:`, err);
                // Redirect to frontend with error
                return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
            }

            // Success: Generate Token & Redirect
            const token = generateToken(user);
            res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
        })(req, res, next);
    };
};