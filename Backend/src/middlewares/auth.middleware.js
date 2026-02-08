const usermodel = require('../database/models/user.model');
const jwt = require('jsonwebtoken');

async function authmiddleware(req, res, next) {
    let token;

    // 1. Token nikalna (Headers se)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // 2. Token verify karna
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // 3. User ko find karna (Role: owner check ke saath)
        const owner = await usermodel.findById(decoded.id);

        if (!owner || owner.role !== 'owner') {
            return res.status(401).json({ message: 'Unauthorized: Owner not found or invalid role' });
        }

        // 4. Request object mein owner ka data daal dena
        req.owner = owner;
        next();
    } catch (err) {
        console.error("JWT Auth Error:", err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// 🚨 Sabse important line jo aap bhool gaye the:
module.exports = authmiddleware;