const usermodel = require('../database/models/user.model');
const Venue = require('../database/models/venue.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. CUSTOMER REGISTER
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

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY || 'your_secret_key');
        return res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

// 3. OWNER + HOTEL REGISTER
// 3. OWNER REGISTER (Updated)
async function ownerragister(req, res) {
    try {
        // Frontend से 'Password' (P capital) आ रहा है, उसे यहाँ handle करें
        const { fullname, email, Password } = req.body;

        if (!Password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // चेक करें कहीं ईमेल पहले से तो नहीं है
        const existing = await usermodel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Owner already exists with this email' });

        const hashed = await bcrypt.hash(Password, 10);

        // ओनर को 'usermodel' में सेव करें (role: 'owner' के साथ)
        const user = new usermodel({
            fullname,
            email,
            password: hashed, // DB में field name 'password' ही रखें
            role: 'owner'
        });

        await user.save();
        res.status(201).json({ message: 'Owner account created successfully! ✨' });

    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ message: "Registration fail", error: err.message });
    }
}

// 4. OWNER LOGIN
async function ownerlogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email, role: 'owner' });
        if (!user) return res.status(400).json({ message: 'Owner account nahi mila!' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Galat password!' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY || 'your_secret_key');
        return res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

async function logout(req, res) { return res.status(200).json({ message: "Logout success" }); }
async function ownerlogout(req, res) { return res.status(200).json({ message: "Owner logout success" }); }

// exports
module.exports = { register, login, logout, ownerragister, ownerlogin, ownerlogout };