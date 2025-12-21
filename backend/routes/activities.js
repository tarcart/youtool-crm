// backend/routes/activities.js
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authenticateToken = require('../middleware/auth');

// 1. GET activities for a specific contact
router.get('/contact/:id', authenticateToken, async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            where: { contactId: parseInt(req.params.id) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(activities);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// 2. POST a new activity (Log a call/note)
router.post('/', authenticateToken, async (req, res) => {
    const { contactId, type, description } = req.body;
    try {
        const newActivity = await prisma.activity.create({
            data: {
                type,
                description,
                contactId: parseInt(contactId),
                userId: req.user.id // Taken from the JWT token
            }
        });
        res.status(201).json(newActivity);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;