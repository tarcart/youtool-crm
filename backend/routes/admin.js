const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

// Middleware: Verify Token AND Check for SUPER_ADMIN role
const verifySuperAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the role inside the token OR the DB says SUPER_ADMIN
        if (decoded.role !== 'SUPER_ADMIN') {
            // Double check database to be safe (in case token is old)
            return prisma.user.findUnique({ where: { id: decoded.id } })
                .then(user => {
                    if (user && user.role === 'SUPER_ADMIN') {
                        req.user = user;
                        next();
                    } else {
                        res.status(403).json({ error: 'Requires Super Admin Privileges' });
                    }
                });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

// 1. DASHBOARD STATS (The "Big Picture")
router.get('/stats', verifySuperAdmin, async (req, res) => {
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
router.get('/companies', verifySuperAdmin, async (req, res) => {
    try {
        const companies = await prisma.company.findMany({
            include: { _count: { select: { users: true } } } // Count users in each company
        });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET ALL USERS (Platform wide)
router.get('/users', verifySuperAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                company: { select: { name: true } }
            }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;