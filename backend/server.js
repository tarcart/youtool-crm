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

// STABLE CORS Configuration
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Session Middleware (Required for Passport)
app.use(session({
    secret: 'youtool_social_secret',
    resave: false,
    saveUninitialized: false
}));

// INITIALIZE PASSPORT
app.use(passport.initialize());

// HEARTBEAT
app.get('/', (req, res) => res.json({ status: "YouTool API is LIVE" }));

// ATTACH ROUTES
app.use('/api/auth', authRoutes);        
app.use('/api/contacts', contactRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/opportunities', oppRoutes);
app.use('/api/activities', activityRoutes); 
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// FORCE PORT 5001 - Bypassing broken env variables
const PORT = 5001;

// ROBUST STARTUP
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