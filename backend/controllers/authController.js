const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (user) => {
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

    // Define permissions for each platform
    if (provider === 'facebook') {
        scope = ['public_profile', 'email'];
    } else if (provider === 'microsoft') {
        scope = ['openid', 'profile', 'email', 'user.read'];
    } else if (provider === 'linkedin') {
        scope = ['openid', 'profile', 'email'];
        // 🚀 Ensure this is also false
        return passport.authenticate(provider, { scope, state: false });
    } else {
        // Default (Google)
        scope = ['profile', 'email'];
    }

    return passport.authenticate(provider, { scope });
};

// Handle Provider Callback
exports.socialCallback = (provider) => {
    return (req, res, next) => {
        // 🚀 FIXED: Added 'state: false' here so it doesn't look for a session
        passport.authenticate(provider, { session: false, state: false }, (err, user, info) => {
            if (err || !user) {
                return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
            }

            const token = generateToken(user);
            
            res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
        })(req, res, next);
    };
};