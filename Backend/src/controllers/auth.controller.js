// ---------------------------------------------------------
// AUTHENTICATION & ADMIN CONTROLLER
// ---------------------------------------------------------

const usermodel = require('../database/models/user.model');
const Venue = require('../database/models/venue.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. CUSTOMER REGISTER (Normal users ke liye)
async function register(req, res) {
    try {
        const { fullname, email, password } = req.body;
        const existing = await usermodel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new usermodel({ fullname, email, password: hashed, role: 'user' });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

// 2. CUSTOMER LOGIN
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email, role: 'user' });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.SECRET_KEY || 'your_secret_key');
        return res.status(200).json({ message: 'Login successful', token, role: 'user', user });
    } catch (err) {
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

// 3. OWNER REGISTER
async function ownerragister(req, res) {
    try {
        const { fullname, email, Password } = req.body;
        if (!Password) return res.status(400).json({ message: "Password is required" });

        const existing = await usermodel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Owner already exists' });

        const hashed = await bcrypt.hash(Password, 10);
        const user = new usermodel({ fullname, email, password: hashed, role: 'owner' });
        await user.save();
        res.status(201).json({ message: 'Owner account created successfully! ✨' });
    } catch (err) {
        res.status(500).json({ message: "Registration fail", error: err.message });
    }
}

// 4. OWNER + ADMIN LOGIN (Updated Logic)
async function ownerlogin(req, res) {
    try {
        const { email, password } = req.body;

        // --- STEP A: ADMIN CHECK (Database check se pehle) ---
        if (email === 'admin@gmail.com' && password === 'admin123') {
            const token = jwt.sign({ id: 'ADMIN_ID', role: 'admin' }, process.env.SECRET_KEY || 'your_secret_key');
            return res.status(200).json({
                message: 'Admin Login successful',
                token,
                role: 'admin', // Frontend isi role ko dekh kar redirect karega
                user: { fullname: "System Admin", email: "admin@gmail.com" }
            });
        }

        // --- STEP B: NORMAL OWNER LOGIN ---
        const user = await usermodel.findOne({ email, role: 'owner' });
        if (!user) return res.status(400).json({ message: 'Owner account nahi mila!' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Galat password!' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY || 'your_secret_key');
        return res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role,
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

// 5. GET ALL USERS (Admin Dashboard ke liye)
async function getAllUsers(req, res) {
    try {
        const users = await usermodel.find({ role: 'user' }).select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Users fetch error" });
    }
}

// 6. GET ALL OWNERS (Admin Dashboard ke liye)
async function getAllOwners(req, res) {
    try {
        const owners = await usermodel.find({ role: 'owner' }).select('-password');
        res.status(200).json(owners);
    } catch (err) {
        res.status(500).json({ message: "Owners fetch error" });
    }
}

// LOGOUT FUNCTIONS
async function logout(req, res) { return res.status(200).json({ message: "Logout success" }); }
async function ownerlogout(req, res) { return res.status(200).json({ message: "Owner logout success" }); }

// Exports
module.exports = {
    register,
    login,
    logout,
    ownerragister,
    ownerlogin,
    ownerlogout,
    getAllUsers,
    getAllOwners // Naye exports
};