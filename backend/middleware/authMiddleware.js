const jwt = require('jsonwebtoken');

// 1. STANDARD LOGIN CHECK (Replaces your old code)
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided.' });
        }

        // Handle "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication failed.' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // SAVE USER INFO TO REQUEST
        // We include 'role' now so the next function can check it
        req.user = { 
            id: decodedToken.id, // Matches the 'id' in your auth.js token
            companyId: decodedToken.companyId,
            email: decodedToken.email,
            role: decodedToken.role 
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// 2. GOD MODE CHECK (New!)
const verifySuperAdmin = (req, res, next) => {
    // This runs AFTER verifyToken, so req.user already exists
    if (!req.user) {
         return res.status(401).json({ error: 'Access Denied: Not Logged In' });
    }

    if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Access Denied: Super Admin Privileges Required' });
    }

    next();
};

// EXPORT BOTH TOOLS
module.exports = { verifyToken, verifySuperAdmin };