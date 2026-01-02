const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
// FIX: Import from the correct new file
const { verifyToken } = require('../middleware/authMiddleware');

// 1. GET activities for a specific contact
router.get('/contact/:id', verifyToken, async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            where: { contactId: parseInt(req.params.id) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(activities);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// 2. POST a new activity (Log a call/note)
router.post('/', verifyToken, async (req, res) => {
    const { contactId, type, description } = req.body;
    try {
        const newActivity = await prisma.activity.create({
            data: {
                type,
                description,
                contactId: parseInt(contactId),
                userId: req.user.id
            }
        });
        res.status(201).json(newActivity);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;