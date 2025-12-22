const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
// FIX: Import from the correct new file
const { verifyToken } = require('../middleware/authMiddleware');

// GET: Dashboard Summary Stats
router.get('/dashboard-summary', verifyToken, async (req, res) => {
    try {
        const companyId = req.user.companyId;

        // 1. Calculate Total Sales (Sum of Closed Won Opportunity values)
        const salesData = await prisma.opportunity.aggregate({
            where: { 
                companyId: companyId,
                stage: 'Closed Won' 
            },
            _sum: { value: true }
        });

        // 2. Calculate Win Rate (Closed Won / Total Closed)
        const wonCount = await prisma.opportunity.count({
            where: { companyId: companyId, stage: 'Closed Won' }
        });
        const totalClosedCount = await prisma.opportunity.count({
            where: { 
                companyId: companyId, 
                stage: { in: ['Closed Won', 'Closed Lost'] } 
            }
        });

        const winRate = totalClosedCount > 0 
            ? ((wonCount / totalClosedCount) * 100).toFixed(1) 
            : "0.0";

        // 3. Pipeline Funnel (Count by Stage)
        const funnelData = await prisma.opportunity.groupBy({
            by: ['stage'],
            where: { companyId: companyId },
            _count: { id: true },
            _sum: { value: true }
        });

        res.json({
            totalSales: salesData._sum.value || 0,
            winRate: `${winRate}%`,
            pipelineFunnel: funnelData,
            topSalesReps: [] 
        });
    } catch (err) {
        console.error("Report Error:", err);
        res.status(500).json({ error: "Failed to calculate dashboard metrics" });
    }
});

module.exports = router;