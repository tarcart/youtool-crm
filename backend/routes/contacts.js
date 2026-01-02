const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient'); 
// 1. IMPORT THE CORRECT MIDDLEWARE NAME
const { verifyToken } = require('../middleware/authMiddleware');

// 2. CREATE CONTACT (POST) - Preserved your Transaction Logic
router.post('/', verifyToken, async (req, res) => {
    const { 
        firstName, lastName, email, organizationId, jobTitle, 
        department, phone, mobile, address, city, state, zip, description, links 
    } = req.body;

    if (!firstName) return res.status(400).json({ error: "First Name is required." });

    try {
        const result = await prisma.$transaction(async (tx) => {
            // A. Create the Contact
            const contact = await tx.contact.create({
                data: {
                    firstName: firstName.trim(),
                    lastName: (lastName || "").trim(),
                    email: email && email.trim() !== "" ? email.trim() : null,
                    jobTitle: jobTitle || null,
                    department: department || null,
                    phone: phone || null,
                    mobile: mobile || null,
                    address: address || null,
                    city: city || null,
                    state: state || null,
                    zip: zip || null,
                    description: description || null,
                    status: 'Lead',
                    company: { connect: { id: req.user.companyId } },
                    organization: (organizationId && organizationId !== "") 
                        ? { connect: { id: parseInt(organizationId) } } 
                        : undefined
                }
            });

            // B. Handle the dynamic Links
            if (links && links.length > 0) {
                const linkPromises = links.map(link => {
                    return tx.contactLink.create({
                        data: {
                            contactId: contact.id,
                            targetType: link.type,
                            targetName: link.name,
                            role: link.role || ""
                        }
                    });
                });
                await Promise.all(linkPromises);
            }

            return contact;
        });
        
        res.status(201).json(result);
    } catch (error) {
        console.error("Contact Save Error:", error.message);
        res.status(500).json({ error: "Save failed: " + error.message });
    }
});

// 3. GET ALL CONTACTS (GET) - THE FIX IS HERE
router.get('/', verifyToken, async (req, res) => { 
    const { search } = req.query;
    try {
        const contacts = await prisma.contact.findMany({
            where: {
                companyId: req.user.companyId,
                status: { not: 'Archived' },
                ...(search ? {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ]
                } : {})
            },
            include: { organization: true, links: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. UPDATE CONTACT (PUT)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { organizationId, ...rest } = req.body;
        const updated = await prisma.contact.update({
            where: { id: parseInt(req.params.id), companyId: req.user.companyId },
            data: { 
                ...rest,
                organizationId: organizationId ? parseInt(organizationId) : undefined 
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. DELETE CONTACT (DELETE)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await prisma.contact.delete({
            where: { id: parseInt(req.params.id), companyId: req.user.companyId }
        });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed: " + error.message });
    }
});

module.exports = router;