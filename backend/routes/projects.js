const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. GET PROJECTS
router.get('/', verifyToken, async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: { companyId: req.user.companyId },
            include: { links: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// 2. CREATE PROJECT
router.post('/', verifyToken, async (req, res) => {
    const { name, startDate, endDate, status, description, links } = req.body;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    name,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                    status: status || 'In Progress',
                    description: description || null,
                    companyId: req.user.companyId
                }
            });
            if (links && links.length > 0) {
                await Promise.all(links.map(link => tx.projectLink.create({
                    data: { projectId: project.id, targetType: link.type, targetName: link.name, role: link.role || "" }
                })));
            }
            return project;
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to save Project safely." });
    }
});

module.exports = router;