const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
// 🚀 NEW: LinkedIn Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Serialize/Deserialize for session-less JWT setup
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Common Logic for Finding or Creating a User
const findOrCreateUser = async (profile, done) => {
    try {
        // LinkedIn puts emails in a slightly different spot, so we check both
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
            return done(new Error("No email found from provider"), null);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: email,
                    name: profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`,
                    passwordHash: null, 
                    role: 'USER',
                    isActive: true, 
                },
            });
        }
        return done(null, user);
    } catch (err) {
        console.error("Prisma Error during social login:", err);
        return done(err, null);
    }
};

// 1. Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, done)));

// 2. Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://youtool.com/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'name']
}, (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, done)));

// 3. Microsoft Strategy
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/microsoft/callback",
    scope: ['user.read']
}, (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, done)));

// 4. LINKEDIN STRATEGY
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/linkedin/callback",
    // 🚀 FIXED: Use modern OpenID scopes instead of legacy ones
    scope: ['openid', 'profile', 'email'],
    state: false
}, (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, done)));

module.exports = passport;