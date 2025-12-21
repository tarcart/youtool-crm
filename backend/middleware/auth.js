const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = { 
            userId: decodedToken.userId, 
            companyId: decodedToken.companyId 
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};