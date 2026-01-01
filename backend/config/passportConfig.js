const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
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

// 🧠 UNIVERSAL USER FINDER
const findOrCreateUser = async (profile, done) => {
    try {
        console.log(`[Auth Debug] Processing login for provider: ${profile.provider}`);
        
        // Robust Email Finding
        const email = 
            (profile.emails && profile.emails[0] ? profile.emails[0].value : null) || 
            profile.email || 
            (profile._json ? profile._json.email : null);

        // Robust Name Finding
        const name = 
            profile.displayName || 
            (profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : null) || 
            (profile._json ? profile._json.name : "User");

        if (!email) {
            console.error("[Auth Error] No email found:", profile);
            return done(null, false, { message: "No email found" });
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
        console.error("Prisma Error:", err);
        return done(err, null);
    }
};

// 1. Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/google/callback"
}, (token, tokenSecret, profile, done) => findOrCreateUser(profile, done)));

// 2. Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://youtool.com/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'name']
}, (token, tokenSecret, profile, done) => findOrCreateUser(profile, done)));

// 3. Microsoft
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/microsoft/callback",
    scope: ['user.read']
}, (token, tokenSecret, profile, done) => findOrCreateUser(profile, done)));

// 4. LinkedIn (Clean Standard Config)
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/linkedin/callback",
    scope: ['openid', 'profile', 'email'],
    state: true // 🚀 WE NOW USE STATE because we added Session support
}, (token, tokenSecret, profile, done) => findOrCreateUser(profile, done)));

module.exports = passport;