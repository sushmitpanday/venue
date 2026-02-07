const usermodel = require('../database/models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. REGISTER
async function register(req, res) {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) return res.status(400).json({ message: 'All fields are required' });

        const existing = await usermodel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new usermodel({ fullname, email, password: hashed });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

// 2. LOGIN (With Cookie Fix for Deployment)
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY || 'your_secret_key');

        // FIX: Deployment par cookies allow karne ke liye options add kiye hain
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Sirf HTTPS par chalega
            sameSite: 'none', // Cross-site support (Vercel frontend -> Vercel backend)
            maxAge: 24 * 60 * 60 * 1000 // 1 din
        });

        return res.status(200).json({ message: 'Login successful', token, user: { fullname: user.fullname, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

// 3. LOGOUT
async function logout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    });
    return res.status(200).json({ message: 'Logout successful' });
}

// OWNER FUNCTIONS (Keeping them for Route Safety)
async function ownerragister(req, res) { res.status(201).json({ message: "Owner logic ready" }); }
async function ownerlogin(req, res) { res.status(200).json({ message: "Owner login ready" }); }
async function ownerlogout(req, res) { res.status(200).json({ message: "Owner logout ready" }); }

module.exports = { register, login, logout, ownerragister, ownerlogin, ownerlogout };