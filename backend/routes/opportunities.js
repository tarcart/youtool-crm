const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authenticateToken = require('../middleware/auth');

// 1. GET ALL DEALS
router.get('/', authenticateToken, async (req, res) => {
    try {
        const deals = await prisma.opportunity.findMany({
            where: { companyId: req.user.companyId },
            include: { 
                contact: true, 
                organization: true,
                links: true // Include the new multiple links
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(deals);
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

// 2. CREATE NEW DEAL (Using Transaction for Data Integrity)
router.post('/', authenticateToken, async (req, res) => {
    const { 
        name, 
        title, 
        value, 
        probability, 
        expectedClose, 
        organizationId, 
        contactId, 
        description, 
        links 
    } = req.body;
    
    try {
        // Use $transaction to ensure both Opportunity and Links save as a single unit
        const result = await prisma.$transaction(async (tx) => {
            
            // A. Create the main Opportunity
            const opportunity = await tx.opportunity.create({
                data: {
                    name: name || title || "New Opportunity", 
                    value: parseFloat(value) || 0,
                    probability: parseInt(probability) || 10,
                    description: description || null,
                    expectedClose: expectedClose ? new Date(expectedClose) : null,
                    companyId: req.user.companyId,
                    
                    // Single relations (legacy support)
                    ...(organizationId && { organizationId: parseInt(organizationId) }),
                    ...(contactId && { contactId: parseInt(contactId) }),
                }
            });

            // B. Save the dynamic "Links" array into the OpportunityLink table
            if (links && links.length > 0) {
                const linkPromises = links.map(link => {
                    return tx.opportunityLink.create({
                        data: {
                            opportunityId: opportunity.id,
                            targetType: link.type,   // Mapped from React 'type'
                            targetName: link.name,   // Mapped from React 'name'
                            role: link.role || ""    // Mapped from React 'role'
                        }
                    });
                });
                await Promise.all(linkPromises);
            }

            return opportunity;
        });

        // If the transaction succeeds, return the created opportunity
        res.status(201).json(result);

    } catch (error) { 
        console.error("Create Opp Transaction Error:", error);
        res.status(500).json({ error: "Failed to save Opportunity and Links safely: " + error.message }); 
    }
});

module.exports = router;