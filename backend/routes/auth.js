const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const prisma = new PrismaClient();

// Define Salt Rounds for Password Hashing
const saltRounds = 10;

// ==========================================
// 1. EMAIL TRANSPORTER SETUP (Brevo Port 2525)
// ==========================================
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER, // This will use the "Robot" login from .env
        pass: process.env.EMAIL_PASS  // This will use the long API Key from .env
    }
});

// ==========================================
// 2. LOGIN ROUTE
// ==========================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ==========================================
// 3. FORGOT PASSWORD ROUTE
// ==========================================
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // Generate a temporary reset token (valid for 1 hour)
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Create the reset link
        const resetLink = `https://youtool.com/reset-password/${resetToken}`;

        // Configure the Email
        const mailOptions = {
            from: '"YouTool Support" <garland@shieldsind.com>', // Shows your real email to the customer
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h3>Password Reset</h3>
                <p>You requested a password reset. Click the link below to set a new password:</p>
                <a href="${resetLink}" style="padding: 10px 20px; background-color: #d35400; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        // Send the Email
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Check your email! We sent you a password reset link.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ error: 'Could not send email. Please try again later.' });
    }
});

module.exports = router;