const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter-oauth2').Strategy; 
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
        const email = profile.emails?.[0]?.value || profile._json?.email;
        const name = profile.displayName || "X User";

        if (!email) {
            console.error("X did not provide an email. Ensure 'Request email' is ON in Portal.");
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

// ... (Google, Facebook, Microsoft, LinkedIn remain same) ...

// 🚀 FINAL X OAUTH 2.0 STRATEGY
passport.use(new TwitterStrategy({
    clientID: process.env.X_CLIENT_ID || process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET || process.env.TWITTER_CLIENT_SECRET,
    clientType: 'confidential',
    callbackURL: process.env.X_CALLBACK_URL || process.env.TWITTER_CALLBACK_URL,
    authorizationURL: 'https://twitter.com/i/oauth2/authorize',
    tokenURL: 'https://api.twitter.com/2/oauth2/token',
    scope: ['tweet.read', 'users.read', 'offline.access'],
    pkce: true, // 👈 Required for many modern X apps
    state: true  // 👈 Required for OAuth 2.0 security
}, (accessToken, refreshToken, profile, done) => {
    findOrCreateUser(profile, done);
}));

module.exports = passport;