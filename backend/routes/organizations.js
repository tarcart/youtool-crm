const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. GET ALL ORGANIZATIONS
router.get('/', verifyToken, async (req, res) => { 
    try {
        const orgs = await prisma.organization.findMany({
            where: { companyId: req.user.companyId },
            include: { 
                _count: { select: { contacts: true } }, 
                links: true 
            },
            orderBy: { name: 'asc' } 
        });
        res.json(orgs);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// 2. CREATE ORGANIZATION
router.post('/', verifyToken, async (req, res) => {
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

// 3. UPDATE ORGANIZATION
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await prisma.organization.update({
            where: { id: parseInt(req.params.id), companyId: req.user.companyId },
            data: req.body
        });
        res.json(updated);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;