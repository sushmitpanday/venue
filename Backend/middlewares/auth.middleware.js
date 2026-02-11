const usermodel = require('../database/models/user.model');
const agentModel = require('../database/models/agent.model');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY || 'your_secret_key_123';

async function authmiddleware(req, res, next) {
    // 1. Token nikaalo (Header ya Cookie dono check karega)
    let token = req.headers.authorization ? .split(" ")[1] || req.cookies ? .token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);

        // 2. Admin Handle (Hardcoded)
        if (decoded.role === 'admin') {
            req.user = { id: 'ADMIN', role: 'admin', fullname: 'System Admin' };
            return next();
        }

        // 3. Agent Handle
        if (decoded.role === 'agent') {
            const agent = await agentModel.findById(decoded.id);
            if (!agent) return res.status(401).json({ message: 'Agent account not found' });
            req.user = agent; // req.user common rakho taaki controller mein dikkat na ho
            return next();
        }

        // 4. Owner/User Handle
        const user = await usermodel.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Account not found' });

        req.user = user;
        next();

    } catch (err) {
        console.error("JWT Auth Error:", err.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
}

module.exports = authmiddleware;