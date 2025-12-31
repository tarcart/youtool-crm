const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Initiate Social Login (Redirects to Google/FB/MS)
exports.socialLogin = (provider) => {
    return passport.authenticate(provider, { scope: ['profile', 'email'] });
};

// Handle Provider Callback
exports.socialCallback = (provider) => {
    return (req, res, next) => {
        passport.authenticate(provider, { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
            }

            // Generate Token
            const token = generateToken(user);
            
            // Redirect to frontend with token in URL (frontend will save it to localStorage)
            res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
        })(req, res, next);
    };
};