// ... (Keep your imports at the top) ...
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

// User Finder Logic
const findOrCreateUser = async (profile, done) => {
    try {
        console.log(`[Auth Debug] Login: ${profile.provider}`);
        const email = (profile.emails?.[0]?.value) || profile.email || profile._json?.email;
        const name = profile.displayName || profile.name?.givenName || profile._json?.name || "User";

        if (!email) {
            console.error("No email found for", profile.provider);
            return done(null, false);
        }

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

// ... (Keep Google, Facebook, Microsoft as they were) ...
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/google/callback"
}, (t, ts, p, done) => findOrCreateUser(p, done)));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://youtool.com/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'name']
}, (t, ts, p, done) => findOrCreateUser(p, done)));

passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/microsoft/callback",
    scope: ['user.read']
}, (t, ts, p, done) => findOrCreateUser(p, done)));

// 🚀 LINKEDIN: FORCE STATELESS
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "https://youtool.com/api/auth/linkedin/callback",
    scope: ['openid', 'profile', 'email'],
    state: false  // <--- Ensure this is FALSE
}, (t, ts, p, done) => findOrCreateUser(p, done)));

module.exports = passport;