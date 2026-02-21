const usermodel = require('../database/models/user.model');
const agentModel = require('../database/models/agent.model');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY || 'your_secret_key_123';

async function authmiddleware(req, res, next) {
    try {
        // 1. Token nikaalo (Space waala error hata diya hai)
        let authHeader = req.headers.authorization;
        let token = (authHeader && authHeader.split(" ")[1]) || (req.cookies && req.cookies.token);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // 2. Token Verify karo
        const decoded = jwt.verify(token, SECRET);

        // 3. ADMIN HANDLE (Isse Admin wala error solve ho jayega)
        if (decoded.role === 'admin' || decoded.id === 'ADMIN_SUPER_ID') {
            req.user = {
                _id: decoded.id || 'ADMIN_SUPER_ID',
                id: decoded.id || 'ADMIN_SUPER_ID',
                role: 'admin',
                fullname: 'System Admin'
            };
            return next(); // Admin ke liye DB check nahi chahiye, sidha aage badho
        }

        // 4. AGENT HANDLE
        if (decoded.role === 'agent') {
            const agent = await agentModel.findById(decoded.id);
            if (!agent) return res.status(401).json({ message: 'Agent account not found' });
            req.user = agent;
            return next();
        }

        // 5. USER/OWNER HANDLE
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