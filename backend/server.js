// 1. MUST BE LINE 1: Load environment variables before anything else!
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
// 2. Now it's safe to import prisma because the env variables exist
const prisma = require('./prismaClient');

// Import Route Files
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const orgRoutes = require('./routes/organizations');
const oppRoutes = require('./routes/opportunities');
const activityRoutes = require('./routes/activities'); 
// NEW ROUTES
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

const app = express();

// 3. STABLE CORS Configuration
// Change this section in server.js
app.use(cors({
    origin: '*', // Allow all local ports to connect while we fix the login
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 4. HEARTBEAT: Root route to verify the server is listening
app.get('/', (req, res) => res.json({ status: "YouTool API is LIVE" }));

// 5. ATTACH ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/opportunities', oppRoutes);
app.use('/api/activities', activityRoutes); 
// NEW ENDPOINTS
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000; // <--- Changed to 5000 to match Frontend

// 6. ROBUST STARTUP
async function startServer() {
    console.log("⏳ Starting YouTool Engine...");
    try {
        await prisma.$connect();
        console.log("✔ YouTool: Digital Ocean Connection Established");
        app.listen(PORT, () => console.log(`🚀 YouTool LIVE on http://localhost:${PORT}`));
    } catch (err) {
        console.error("✘ CRITICAL DB ERROR:", err.message);
        process.exit(1);
    }
}

startServer();