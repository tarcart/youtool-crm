const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const https = require('https'); 
const querystring = require('querystring'); 
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (user) => {
    return jwt.sign({ 
        id: user.id, email: user.email, role: user.role, companyId: user.companyId 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const finishLogin = async (res, email, name) => {
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: { email, name: name || "User", role: 'USER', isActive: true }
            });
        }
        const token = generateToken(user);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (err) { res.redirect(`${process.env.FRONTEND_URL}/signin?error=db_error`); }
};

const handleAuthError = (res, provider, err) => {
    console.error(`[${provider} Error]:`, err.response?.data || err.message);
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed&provider=${provider}`);
};

// HANDLERS
const handleFacebookManual = async (req, res) => {
    try {
        const { code } = req.query;
        const redirectUri = 'https://youtool.com/api/auth/facebook/callback';
        if (!code) {
            return res.redirect(`https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile&response_type=code`);
        }
        const tokenRes = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
            params: { client_id: process.env.FACEBOOK_APP_ID, client_secret: process.env.FACEBOOK_APP_SECRET, redirect_uri: redirectUri, code: code }
        });
        const userRes = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenRes.data.access_token}`);
        finishLogin(res, userRes.data.email, userRes.data.name);
    } catch (err) { handleAuthError(res, "Facebook", err); }
};

const handleXManual = async (req, res) => {
    try {
        const { code } = req.query;
        const redirectUri = 'https://youtool.com/api/auth/x/callback';
        const codeVerifier = 'youtool_crm_secure_pkce_2026'; 
        const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
        if (!code) {
            return res.redirect(`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.X_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20users.read%20offline.access&state=manual_x&code_challenge=${codeChallenge}&code_challenge_method=S256`);
        }
        const authHeader = Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString('base64');
        const params = new URLSearchParams({ code, grant_type: 'authorization_code', redirect_uri: redirectUri, code_verifier: codeVerifier });
        const tokenRes = await axios.post('https://api.twitter.com/2/oauth2/token', params, { headers: { 'Authorization': `Basic ${authHeader}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
        const userRes = await axios.get('https://api.twitter.com/2/users/me', { headers: { Authorization: `Bearer ${tokenRes.data.access_token}` } });
        finishLogin(res, `${userRes.data.data.username}@x.social`, userRes.data.data.name);
    } catch (err) { handleAuthError(res, "X", err); }
};

exports.socialLogin = (provider) => (req, res, next) => {
    if (provider === 'facebook') return handleFacebookManual(req, res);
    if (provider === 'x' || provider === 'twitter') return handleXManual(req, res);
    passport.authenticate(provider, { scope: ['email', 'profile'] })(req, res, next);
};

exports.socialCallback = (provider) => (req, res, next) => {
    if (provider === 'facebook') return handleFacebookManual(req, res);
    if (provider === 'x' || provider === 'twitter') return handleXManual(req, res);
    passport.authenticate(provider, { session: false }, (err, user) => {
        if (err || !user) return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
        finishLogin(res, user.email, user.name);
    })(req, res, next);
};