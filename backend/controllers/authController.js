const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

// ------------------------------------------------------------------
// 🚀 MANUAL LINKEDIN LOGIC (Bypasses Passport Session Issues)
// ------------------------------------------------------------------
const handleLinkedInManual = async (req, res) => {
    try {
        const { code } = req.query;
        
        // 1. If no code, start the login process
        if (!code) {
            const redirectUri = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent('https://youtool.com/api/auth/linkedin/callback')}&scope=openid%20profile%20email&state=manual_bypass`;
            return res.redirect(redirectUri);
        }

        // 2. If code exists, swap it for a Token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'https://youtool.com/api/auth/linkedin/callback',
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // 3. Get User Profile
        const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const profile = userResponse.data;

        if (!profile.email) throw new Error("No email found in LinkedIn profile");

        // 4. Find or Create User in DB
        let user = await prisma.user.findUnique({ where: { email: profile.email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: profile.email,
                    name: profile.name || "LinkedIn User",
                    role: 'USER',
                    isActive: true
                }
            });
        }

        // 5. Success! Redirect to Dashboard
        const token = generateToken(user);
        res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);

    } catch (error) {
        console.error("LinkedIn Manual Auth Error:", error.response?.data || error.message);
        res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
    }
};

// ------------------------------------------------------------------
// STANDARD PASSPORT LOGIC (Google, Facebook, Microsoft)
// ------------------------------------------------------------------

exports.socialLogin = (provider) => {
    return (req, res, next) => {
        // 🚀 HIJACK LINKEDIN
        if (provider === 'linkedin') return handleLinkedInManual(req, res);

        let scope;
        if (provider === 'facebook') scope = ['public_profile', 'email'];
        else if (provider === 'microsoft') scope = ['openid', 'profile', 'email', 'user.read'];
        else scope = ['profile', 'email'];

        passport.authenticate(provider, { scope })(req, res, next);
    };
};

exports.socialCallback = (provider) => {
    return (req, res, next) => {
        // 🚀 HIJACK LINKEDIN
        if (provider === 'linkedin') return handleLinkedInManual(req, res);

        passport.authenticate(provider, { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
            }
            const token = generateToken(user);
            res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
        })(req, res, next);
    };
};