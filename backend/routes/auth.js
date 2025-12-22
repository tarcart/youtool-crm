const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // <--- NEW IMPORT
const prisma = require('../prismaClient'); 
const router = express.Router();

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'youtool_super_secret_key';

// CONFIGURE EMAIL TRANSPORTER (GMAIL)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. REGISTER
router.post('/register', async (req, res) => {
    const { name, companyName, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const emailToken = crypto.randomBytes(32).toString('hex');

        await prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({ where: { email } });
            if (existingUser) throw new Error("User already exists");

            const newCompany = await tx.company.create({ data: { name: companyName } });

            await tx.user.create({
                data: { 
                    name, 
                    email, 
                    passwordHash, 
                    role: 'ADMIN', 
                    companyId: newCompany.id,
                    isActive: false, 
                    emailToken: emailToken 
                }
            });
        });

        // --- SEND REAL EMAIL ---
        const verifyLink = `http://localhost:5173/verify-email?token=${emailToken}`;
        
        const mailOptions = {
            from: `"YouTool Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your YouTool Account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #d94d11;">Welcome to YouTool!</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for joining. Please verify your email to activate your account.</p>
                    <a href="${verifyLink}" style="background-color: #d94d11; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify My Account</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ REAL EMAIL SENT TO:", email);

        res.status(201).json({ 
            message: 'Registration successful! Please check your email to activate your account.' 
        });

    } catch (error) {
        console.error("Registration Error:", error.message);
        if (error.message === "User already exists") {
            return res.status(400).json({ error: "User already exists" });
        }
        res.status(500).json({ error: error.message });
    }
});

// 2. VERIFY EMAIL
router.post('/verify-email', async (req, res) => {
    const { token } = req.body;
    try {
        const user = await prisma.user.findFirst({ where: { emailToken: token } });
        if (!user) return res.status(400).json({ error: "Invalid or expired token." });

        await prisma.user.update({
            where: { id: user.id },
            data: { isActive: true, emailToken: null }
        });

        res.json({ message: "Account verified successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true }
        });

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        if (!user.isActive) {
            return res.status(403).json({ error: 'Please verify your email to activate your account.' });
        }

        if (user.company && user.company.isActive === false) {
             return res.status(403).json({ error: 'Company account deactivated.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, companyId: user.companyId, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                companyName: user.company?.name, 
                role: user.role 
            } 
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;