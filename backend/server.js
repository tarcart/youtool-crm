// 1. MUST BE LINE 1: Load environment variables before anything else!
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const passport = require('./config/passportConfig'); // ADDED: Passport initialization
const prisma = require('./prismaClient');

// Import Route Files
const authRoutes = require('./routes/auth');
const socialAuthRoutes = require('./routes/authRoutes'); // ADDED: New social routes
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

// 3. INITIALIZE PASSPORT (Must be before routes)
app.use(passport.initialize());

// 4. HEARTBEAT
app.get('/', (req, res) => res.json({ status: "YouTool API is LIVE" }));

// 5. ATTACH ROUTES
app.use('/api/auth', authRoutes);       // Your existing email/pass login
app.use('/api/auth', socialAuthRoutes); // ADDED: Your new Google/FB/MS logins
app.use('/api/contacts', contactRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/opportunities', oppRoutes);
app.use('/api/activities', activityRoutes); 
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

// 6. ROBUST STARTUP
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