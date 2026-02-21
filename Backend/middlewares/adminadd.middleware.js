const jwt = require('jsonwebtoken');

const adminProtect = async(req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith('Bearer')) {
            token = token.split(' ')[1];

            // FIX: Yahan SECRET_KEY use kar jo teri .env mein hai
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            req.user = decoded;
            next();
        } else {
            res.status(401).json({ message: "Bhai, token missing hai!" });
        }
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(401).json({ message: "Token galat hai ya expire ho gaya!" });
    }
};

module.exports = adminProtect;