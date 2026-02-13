// admin.middleware.js
const adminProtect = (req, res, next) => {
    // req.user aapke main authMiddleware se aa raha hoga
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: "Aapka access denied hai! Sirf Admin hi ye dekh sakta hai."
        });
    }
};

module.exports = adminProtect;