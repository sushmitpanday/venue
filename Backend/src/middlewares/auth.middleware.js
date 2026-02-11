const usermodel = require('../database/models/user.model');
const agentModel = require('../database/models/agent.model');
const jwt = require('jsonwebtoken');

// Secret Key match honi chahiye controllers wale se
const SECRET = process.env.SECRET_KEY || 'your_secret_key_123';

async function authmiddleware(req, res, next) {
    let token = null;

    // 1. Token Extraction (Safe way)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // 2. Verify Token
        const decoded = jwt.verify(token, SECRET);

        // 3. Admin Bypass
        if (decoded.role === 'admin') {
            req.user = { fullname: "Admin", role: 'admin' };
            return next();
        }

        // 4. Agent Check
        if (decoded.role === 'agent') {
            const agent = await agentModel.findById(decoded.id);
            if (!agent) {
                return res.status(401).json({ message: 'Agent not found' });
            }
            req.user = agent;
            req.role = 'agent';
            return next();
        }

        // 5. User/Owner Check
        const user = await usermodel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.role = user.role;
        next();

    } catch (err) {
        console.error("Auth Error:", err.message);
        return res.status(401).json({ message: 'Invalid or Expired Token' });
    }
}

module.exports = authmiddleware;