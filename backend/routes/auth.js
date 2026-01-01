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

// ------------------------------------------------------------------
// 1. LOCAL LOGIN
// ------------------------------------------------------------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, companyId: user.companyId }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ------------------------------------------------------------------
// 2. PASSWORD RESET ROUTES
// ------------------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Email not found' });

        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `https://youtool.com/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: '"YouTool Support" <garland@shieldsind.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `<h3>Password Reset</h3><p>Click here: <a href="${resetLink}">Reset Password</a></p>`
        });

        res.json({ message: 'Check your email!' });
    } catch (error) {
        res.status(500).json({ error: 'Could not send email.' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hash = await bcrypt.hash(newPassword, saltRounds);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { passwordHash: hash }
        });
        res.json({ message: 'Password updated successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

// ------------------------------------------------------------------
// 3. SOCIAL LOGIN ROUTES
// ------------------------------------------------------------------

// Google
router.get('/google', authController.socialLogin('google'));
router.get('/google/callback', authController.socialCallback('google'));

// Facebook
router.get('/facebook', authController.socialLogin('facebook'));
router.get('/facebook/callback', authController.socialCallback('facebook'));

// Microsoft
router.get('/microsoft', authController.socialLogin('microsoft'));
router.get('/microsoft/callback', authController.socialCallback('microsoft'));

// LinkedIn
router.get('/linkedin', authController.socialLogin('linkedin'));
router.get('/linkedin/callback', authController.socialCallback('linkedin'));

// 🚀 Instagram (Added)
router.get('/instagram', authController.socialLogin('instagram'));
router.get('/instagram/callback', authController.socialCallback('instagram'));

// 🚀 Twitter (Added to match your controller)
router.get('/twitter', authController.socialLogin('twitter'));
router.get('/twitter/callback', authController.socialCallback('twitter'));

// 🚀 TikTok (Added to match your controller)
router.get('/tiktok', authController.socialLogin('tiktok'));
router.get('/tiktok/callback', authController.socialCallback('tiktok'));

module.exports = router;
