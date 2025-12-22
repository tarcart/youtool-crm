const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken, verifySuperAdmin } = require('../middleware/authMiddleware');

// 1. DASHBOARD STATS
router.get('/stats', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const [companyCount, userCount, oppCount, revenue] = await Promise.all([
            prisma.company.count(),
            prisma.user.count(),
            prisma.opportunity.count(),
            prisma.opportunity.aggregate({ _sum: { value: true } })
        ]);

        res.json({
            totalCompanies: companyCount,
            totalUsers: userCount,
            totalOpportunities: oppCount,
            totalPipelineValue: revenue._sum.value || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL COMPANIES
router.get('/companies', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const companies = await prisma.company.findMany({
            include: { _count: { select: { users: true } } },
            orderBy: { id: 'asc' }
        });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET ALL USERS
router.get('/users', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                emailToken: true,
                company: { select: { name: true } }
            },
            orderBy: { id: 'asc' }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. TOGGLE USER STATUS
router.patch('/users/:id/status', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { isActive } = req.body; 

        if (userId === req.user.id && isActive === false) {
             return res.status(400).json({ error: "You cannot ban yourself." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                isActive: isActive,
                emailToken: isActive ? null : undefined 
            }
        });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. TOGGLE COMPANY STATUS
router.patch('/companies/:id/status', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const companyId = parseInt(req.params.id);
        const { isActive } = req.body;

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: { isActive: isActive }
        });

        res.json(updatedCompany);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. DELETE USER
router.delete('/users/:id', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (userId === req.user.id) return res.status(400).json({ error: "Cannot delete yourself." });

        await prisma.user.delete({ where: { id: userId } });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;