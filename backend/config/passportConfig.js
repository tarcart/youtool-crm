const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Serialize/Deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// 🧠 SMARTER USER FINDER (Handles different email locations)
const findOrCreateUser = async (profile, done) => {
    try {
        console.log(`[Auth Debug] Processing login for provider: ${profile.provider}`);
        
        // 🚀 FIX: Look for email in ALL possible places (OIDC vs Legacy)
        const email = 
            (profile.emails && profile.emails[0] ? profile.emails[0].value : null) || 
            profile.email || 
            (profile._json ? profile._json.email : null);

        // 🚀 FIX: Look for name in ALL possible places
        const name = 
            profile.displayName || 
            (profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : null) || 
            (profile._json ? profile._json.name : "User");

        if (!email) {
            console.error("[Auth Error] No email found in profile:", profile);
            return done(new Error("No email found from provider"), null);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log(`[Auth Debug] Creating new user for ${email}`);
            user = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
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

// 4. LinkedIn Strategy (Updated for OpenID)
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/linkedin/callback",
    scope: ['openid', 'profile', 'email'], // Modern Scopes
    state: false 
}, (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, done)));

module.exports = passport;