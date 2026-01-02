require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passportConfig');
const prisma = require('./prismaClient');

// Import Route Files
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const orgRoutes = require('./routes/organizations');
const oppRoutes = require('./routes/opportunities');
const activityRoutes = require('./routes/activities');
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

const app = express();

// 2. STABLE CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 3. Session Middleware (Must be BEFORE passport.initialize)
app.use(session({
    secret: 'youtool_social_secret',
    resave: false,
    saveUninitialized: false
}));

// 4. INITIALIZE PASSPORT
app.use(passport.initialize());

// 5. HEARTBEAT
app.get('/', (req, res) => res.json({ status: "YouTool API is LIVE" }));

// 6. ATTACH ROUTES
app.use('/api/auth', authRoutes);
// REMOVED: socialAuthRoutes line that was causing the crash
app.use('/api/contacts', contactRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/opportunities', oppRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// FORCE PORT 5001
const PORT = 5001;

// 7. ROBUST STARTUP
async function startServer() {
    console.log("⏳ Starting YouTool Engine...");
    try {
        await prisma.$connect();
        console.log("✔ YouTool: Digital Ocean Connection Established");
        app.listen(PORT, () => console.log(`🚀 YouTool LIVE on port ${PORT}`));
    } catch (err) {
        console.error("✘ CRITICAL DB ERROR:", err.message);
        process.exit(1);
    }
}

startServer();
