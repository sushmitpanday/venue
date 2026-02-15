const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: "Login karein pehle!" });

    const token = authHeader.split(' ')[1]; // Space error fix
    if (!token) return res.status(401).json({ message: "Token missing!" });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Session expired!" });
    }
};

module.exports = authMiddleware;