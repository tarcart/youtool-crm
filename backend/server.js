require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passportConfig');
const prisma = require('./prismaClient');

// Import Route Files - Verified matching your local folder
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

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: 'youtool_social_secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

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

// FIXED PORT 5001 for Digital Ocean Nginx
const PORT = 5001;

async function startServer() {
    try {
        await prisma.$connect();
        app.listen(PORT, () => console.log(`🚀 YouTool LIVE on port ${PORT}`));
    } catch (err) {
        console.error("✘ CRITICAL DB ERROR:", err.message);
        process.exit(1);
    }
}

startServer();