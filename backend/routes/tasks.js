const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient'); 
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { companyId: req.user.companyId },
            include: { links: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { subject, dueDate, description, priority, links } = req.body;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const task = await tx.task.create({
                data: {
                    subject,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    priority: priority || 'Normal', // Preserved original default
                    description: description || null, // Preserved original field
                    status: 'Open', // Preserved original default
                    companyId: req.user.companyId
                }
            });
            if (links && links.length > 0) {
                await Promise.all(links.map(link => tx.taskLink.create({
                    data: { taskId: task.id, targetType: link.type, targetName: link.name, role: link.role || "" }
                })));
            }
            return task;
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to save Task safely." });
    }
});

module.exports = router;