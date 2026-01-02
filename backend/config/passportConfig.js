const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter-oauth2').Strategy; 
const TikTokStrategy = require('passport-tiktok-auth').Strategy; // 👈 New Import
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const findOrCreateUser = async (profile, done) => {
    try {
        console.log(`[Auth Debug] Provider: ${profile.provider}`);
        // TikTok doesn't always provide an email; we create a fallback if missing
        const email = profile.emails?.[0]?.value || profile._json?.email || `${profile.id}@tiktok.user`;
        const name = profile.displayName || "TikTok User";

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: { email, name, role: 'USER', isActive: true },
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
};

// 🚀 GOOGLE STRATEGY
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5001/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    findOrCreateUser(profile, done);
}));

// 🚀 FACEBOOK STRATEGY
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://youtool.com/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => {
    findOrCreateUser(profile, done);
}));

// 🚀 TIKTOK STRATEGY
passport.use(new TikTokStrategy({
    clientID: process.env.TIKTOK_CLIENT_KEY, // TikTok calls this Client Key
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    callbackURL: process.env.TIKTOK_CALLBACK_URL || "http://localhost:5001/api/auth/tiktok/callback",
    scope: ['user.info.basic'],
}, (accessToken, refreshToken, profile, done) => {
    findOrCreateUser(profile, done);
}));

// 🚀 X (TWITTER) STRATEGY
passport.use(new TwitterStrategy({
    clientID: process.env.X_CLIENT_ID || process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET || process.env.TWITTER_CLIENT_SECRET,
    clientType: 'confidential',
    callbackURL: process.env.X_CALLBACK_URL || process.env.TWITTER_CALLBACK_URL,
    authorizationURL: 'https://twitter.com/i/oauth2/authorize',
    tokenURL: 'https://api.twitter.com/2/oauth2/token',
    scope: ['tweet.read', 'users.read', 'offline.access'],
    pkce: true,
    state: true 
}, (accessToken, refreshToken, profile, done) => {
    findOrCreateUser(profile, done);
}));

module.exports = passport;