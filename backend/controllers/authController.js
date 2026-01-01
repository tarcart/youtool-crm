const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const https = require('https'); 
const querystring = require('querystring'); 
const crypto = require('crypto'); // Required for X PKCE
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------
const generateToken = (user) => {
    return jwt.sign({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        companyId: user.companyId 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const finishLogin = async (res, email, name) => {
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: { email, name, role: 'USER', isActive: true }
            });
        }
        const token = generateToken(user);
        const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
        console.log("Redirecting to dashboard:", redirectUrl);
        res.redirect(redirectUrl);
    } catch (err) {
        console.error("DB Error in finishLogin:", err);
        res.redirect(`${process.env.FRONTEND_URL}/signin?error=db_error`);
    }
};

const handleAuthError = (res, provider, err) => {
    console.error(`[${provider} Error]:`, err);
    const details = err.response?.data || err.message || "Unknown Error";
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed&details=${encodeURIComponent(JSON.stringify(details))}`);
};

// ------------------------------------------------------------------
// 🚀 X (TWITTER) HANDLER
// ------------------------------------------------------------------
const handleXManual = async (req, res) => {
    try {
        const { code } = req.query;
        const redirectUri = 'https://youtool.com/api/auth/x/callback';
        const codeVerifier = 'youtool_crm_secure_pkce_2026'; 
        const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

        if (!code) {
            const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.X_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20users.read%20offline.access&state=manual_x&code_challenge=${codeChallenge}&code_challenge_method=S256`;
            return res.redirect(authUrl);
        }

        const authHeader = Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString('base64');
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', redirectUri);
        params.append('code_verifier', codeVerifier);

        const tokenRes = await axios.post('https://api.twitter.com/2/oauth2/token', params, {
            headers: { 'Authorization': `Basic ${authHeader}`, 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const userRes = await axios.get('https://api.twitter.com/2/users/me', {
            headers: { Authorization: `Bearer ${tokenRes.data.access_token}` }
        });

        finishLogin(res, `${userRes.data.data.username}@x.social`, userRes.data.data.name || userRes.data.data.username);
    } catch (err) { handleAuthError(res, "X", err); }
};

// ------------------------------------------------------------------
// 🚀 MICROSOFT HANDLER
// ------------------------------------------------------------------
const handleMicrosoftManual = async (req, res) => {
    try {
        const { code } = req.query;
        const redirectUri = 'https://youtool.com/api/auth/microsoft/callback';
        const scope = 'openid profile email User.Read';
        
        if (!code) {
            const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent(scope)}&state=manual_microsoft`;
            return res.redirect(authUrl);
        }

        const params = new URLSearchParams();
        params.append('client_id', process.env.MICROSOFT_CLIENT_ID);
        params.append('client_secret', process.env.MICROSOFT_CLIENT_SECRET);
        params.append('code', code);
        params.append('redirect_uri', redirectUri);
        params.append('grant_type', 'authorization_code');
        params.append('scope', scope);

        const tokenRes = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', params);
        const userRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${tokenRes.data.access_token}` }
        });

        finishLogin(res, userRes.data.mail || userRes.data.userPrincipalName, userRes.data.displayName || "Microsoft User");
    } catch (err) { handleAuthError(res, "Microsoft", err); }
};

// ------------------------------------------------------------------
// 🚀 INSTAGRAM HANDLER
// ------------------------------------------------------------------
const handleInstagramManual = async (req, res) => {
    try {
        const { code, error } = req.query;
        const redirectUrl = 'https://youtool.com/api/auth/instagram/callback';
        if (error) return res.redirect(`${process.env.FRONTEND_URL}/signin?error=instagram_cancel`);

        if (!code) {
            const scopes = ['instagram_business_basic','instagram_business_manage_messages','instagram_business_manage_comments','instagram_business_content_publish','instagram_business_manage_insights'];
            const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${scopes.join(',')}&state=manual_instagram`;
            return res.redirect(authUrl);
        }

        const postData = querystring.stringify({
            client_id: process.env.INSTAGRAM_CLIENT_ID,
            client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: redirectUrl,
            code: code
        });

        const options = {
            hostname: 'api.instagram.com',
            path: '/oauth/access_token',
            method: 'POST', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
        };

        const tokenResponse = await new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {
                    try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
                });
            });
            request.write(postData);
            request.end();
        });

        const { access_token } = tokenResponse;
        const userRes = await axios.get(`https://graph.instagram.com/me?fields=id,username,name,account_type&access_token=${access_token}`);
        finishLogin(res, `${userRes.data.username}@instagram.social`, userRes.data.name || userRes.data.username);
    } catch (err) { handleAuthError(res, "Instagram", err); }
};

// ------------------------------------------------------------------
// 🚀 LINKEDIN HANDLER
// ------------------------------------------------------------------
const handleLinkedInManual = async (req, res) => {
    try {
        const { code } = req.query;
        const redirectUri = 'https://youtool.com/api/auth/linkedin/callback';
        if (!code) {
            const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&state=manual_linkedin`;
            return res.redirect(authUrl);
        }
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);
        params.append('client_id', process.env.LINKEDIN_CLIENT_ID);
        params.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);
        const tokenRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', params);
        const userRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenRes.data.access_token}` }
        });
        finishLogin(res, userRes.data.email, userRes.data.name || "LinkedIn User");
    } catch (err) { handleAuthError(res, "LinkedIn", err); }
};

// ------------------------------------------------------------------
// ⚡ EXPORTS
// ------------------------------------------------------------------
exports.socialLogin = (provider) => (req, res, next) => {
    if (provider === 'x') return handleXManual(req, res);
    if (provider === 'linkedin') return handleLinkedInManual(req, res);
    if (provider === 'instagram') return handleInstagramManual(req, res);
    if (provider === 'microsoft' || provider === 'office365' || provider === 'windowslive') return handleMicrosoftManual(req, res);
    passport.authenticate(provider, { scope: ['email', 'profile'] })(req, res, next);
};

exports.socialCallback = (provider) => (req, res, next) => {
    if (provider === 'x') return handleXManual(req, res);
    if (provider === 'linkedin') return handleLinkedInManual(req, res);
    if (provider === 'instagram') return handleInstagramManual(req, res);
    if (provider === 'microsoft' || provider === 'office365' || provider === 'windowslive') return handleMicrosoftManual(req, res);
    
    passport.authenticate(provider, { session: false }, (err, user) => {
        if (err || !user) return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
        const token = generateToken(user);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    })(req, res, next);
};
