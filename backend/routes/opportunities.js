const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. GET ALL DEALS
router.get('/', verifyToken, async (req, res) => {
    try {
        const deals = await prisma.opportunity.findMany({
            where: { companyId: req.user.companyId },
            include: { 
                contact: true, 
                organization: true,
                links: true 
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(deals);
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

// 2. CREATE NEW DEAL
router.post('/', verifyToken, async (req, res) => {
    const { 
        name, title, value, probability, expectedClose, 
        organizationId, contactId, description, links 
    } = req.body;
    
    try {
        const result = await prisma.$transaction(async (tx) => {
            const opportunity = await tx.opportunity.create({
                data: {
                    name: name || title || "New Opportunity", 
                    value: parseFloat(value) || 0,
                    probability: parseInt(probability) || 10,
                    description: description || null,
                    expectedClose: expectedClose ? new Date(expectedClose) : null,
                    companyId: req.user.companyId,
                    ...(organizationId && { organizationId: parseInt(organizationId) }),
                    ...(contactId && { contactId: parseInt(contactId) }),
                }
            });

            if (links && links.length > 0) {
                const linkPromises = links.map(link => {
                    return tx.opportunityLink.create({
                        data: {
                            opportunityId: opportunity.id,
                            targetType: link.type,
                            targetName: link.name,
                            role: link.role || ""
                        }
                    });
                });
                await Promise.all(linkPromises);
            }
            return opportunity;
        });
        res.status(201).json(result);
    } catch (error) { 
        console.error("Create Opp Transaction Error:", error);
        res.status(500).json({ error: "Failed to save Opportunity: " + error.message }); 
    }
});

module.exports = router;