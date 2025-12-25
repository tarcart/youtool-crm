const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Define Salt Rounds for Password Hashing
const saltRounds = 10;

// ==========================================
// 1. EMAIL TRANSPORTER SETUP
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ==========================================
// 2. LOGIN ROUTE (Fixed for Password Reset)
// ==========================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // 2. Check if user exists
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 3. Compare the password with the stored 'passwordHash'
        // 'bcrypt.compare' takes the plain text password and checks it against the encrypted hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 4. (Optional) Check if user is active
        // if (!user.isActive) {
        //     return res.status(403).json({ error: "Please verify your email first." });
        // }

        // 5. Success! Return user data
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                companyId: user.companyId
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login." });
    }
});

// ==========================================
// 3. FORGOT PASSWORD (Request Link)
// ==========================================
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            // We return success to prevent email scanning by hackers
            return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
        }

        // 1. Generate Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

        // 2. Save to Database
        await prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpires }
        });

        // 3. Send Email
        // CHANGE THIS URL IF DEPLOYING TO PRODUCTION (e.g. https://youtool.com/reset-password/)
        const resetLink = `https://youtool.com/reset-password/${resetToken}`; 

        const mailOptions = {
            from: `"YouTool Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your YouTool Password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #d94d11;">Password Reset Request</h2>
                    <p>Hi ${user.name},</p>
                    <p>We received a request to reset your password. Click the button below to choose a new one.</p>
                    <a href="${resetLink}" style="background-color: #d94d11; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">This link expires in 10 minutes. If you didn't ask for this, please ignore it.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset link sent to your email." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Could not send email." });
    }
});

// ==========================================
// 4. RESET PASSWORD (Actual Change)
// ==========================================
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // 1. Find user with this token AND make sure it hasn't expired
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        // 2. Hash new password
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // 3. Update User (and clear the token)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: passwordHash, 
                resetToken: null,
                resetTokenExpires: null
            }
        });

        res.json({ message: "Password successfully updated! You can now login." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Could not reset password." });
    }
});

module.exports = router;