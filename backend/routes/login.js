const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient'); // Uses the shared client

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                companyId: user.company.id, 
                role: user.role 
            },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                companyName: user.company.name
            }
        });

    } catch (error) {
        console.error("DEBUG LOGIN ERROR:", error); 
        return res.status(500).json({ error: "Server Error", detail: error.message });
    }
});

module.exports = router;