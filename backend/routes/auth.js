const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const prisma = new PrismaClient();
const authController = require('../controllers/authController'); 

const saltRounds = 10;

// EMAIL TRANSPORTER (Brevo)
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

// 1. LOCAL LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'User not found' });
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ error: 'Invalid password' });
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, companyId: user.companyId }, 
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});

// 2. SOCIAL LOGIN ROUTES
// These dynamically route to your manual handlers in authController.js
const providers = ['google', 'facebook', 'microsoft', 'linkedin', 'instagram', 'x', 'twitter', 'tiktok'];

providers.forEach(provider => {
    router.get(`/${provider}`, authController.socialLogin(provider));
    router.get(`/${provider}/callback`, authController.socialCallback(provider));
});

module.exports = router;