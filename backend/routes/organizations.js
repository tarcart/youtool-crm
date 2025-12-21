const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const orgs = await prisma.organization.findMany({
            where: { companyId: req.user.companyId },
            include: { 
                _count: { select: { contacts: true } }, // Preserved original inclusion
                links: true 
            },
            orderBy: { name: 'asc' } // Preserved original sort order
        });
        res.json(orgs);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', authenticateToken, async (req, res) => {
    const { name, industry, website, links } = req.body;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: { name, industry, website, companyId: req.user.companyId }
            });
            if (links && links.length > 0) {
                await Promise.all(links.map(link => tx.organizationLink.create({
                    data: { organizationId: org.id, targetType: link.type, targetName: link.name, role: link.role || "" }
                })));
            }
            return org;
        });
        res.status(201).json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updated = await prisma.organization.update({
            where: { id: parseInt(req.params.id), companyId: req.user.companyId },
            data: req.body
        });
        res.json(updated);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;