const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (user) => {
    // 🚀 FIXED: Now includes role and companyId so the Admin Middleware permits access
    return jwt.sign({ 
        id: user.id, 
        email: user.email,
        role: user.role,           // <--- Critical for Admin Access
        companyId: user.companyId  // <--- Required for data filtering
    }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Initiate Social Login (Redirects to Google/FB/MS)
exports.socialLogin = (provider) => {
    // Facebook requires 'public_profile' instead of 'profile'
    const scope = provider === 'facebook' 
        ? ['public_profile', 'email'] 
        : ['profile', 'email'];

    return passport.authenticate(provider, { scope });
};

// Handle Provider Callback
exports.socialCallback = (provider) => {
    return (req, res, next) => {
        passport.authenticate(provider, { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
            }

            // Generate Token (Now with SUPER_ADMIN powers included)
            const token = generateToken(user);
            
            // Redirect to frontend with token in URL (frontend will save it to localStorage)
            res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
        })(req, res, next);
    };
};