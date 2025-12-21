const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const prisma = require('../prismaClient'); 
const router = express.Router();

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'youtool_super_secret_key';

// 1. REGISTER
router.post('/register', async (req, res) => {
    const { companyName, email, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const result = await prisma.$transaction(async (tx) => {
            // Check if user exists
            const existingUser = await tx.user.findUnique({ where: { email } });
            if (existingUser) throw new Error("User already exists.");

            // Create Company & User
            const newCompany = await tx.company.create({ data: { name: companyName } });
            const newUser = await tx.user.create({
                data: { 
                    email, 
                    passwordHash, 
                    role: 'ADMIN', // Default role for new signups
                    companyId: newCompany.id 
                }
            });
            return { company: newCompany, user: newUser };
        });

        res.status(201).json({ message: 'Success', userId: result.user.id });

    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find User AND fetch their Company info
        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true }
        });

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // 2. CHECK: Is the Company Active? (NEW SECURITY CHECK)
        if (user.company && user.company.isActive === false) {
             return res.status(403).json({ error: 'Your company account has been deactivated. Contact Support.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // --- UPDATE 1: Add Role to Token (for Backend Middleware) ---
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                companyId: user.companyId,
                role: user.role // <--- IMPORTANT: Middleware needs this!
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // --- UPDATE 2: Add Role to Response (for Frontend Sidebar) ---
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                companyName: user.company?.name,
                companyId: user.companyId,
                role: user.role // <--- IMPORTANT: Frontend needs this!
            } 
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;