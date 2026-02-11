const usermodel = require('../database/models/user.model');
const AgentModel = require('../database/models/agent.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY || 'your_secret_key_123';

// 1. CUSTOMER REGISTER
// 1. SIMPLE CUSTOMER REGISTER (Updated)
async function register(req, res) {
    try {
        // Frontend se aane wale data ko destructure karein
        // Note: Agar customer Govt ID nahi de raha, toh default values bhejni hogi ya model se required hatana hoga
        const { fullname, email, Password, phone, address, occupation, govtIdType, govtIdNumber } = req.body;

        const existing = await usermodel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        // Password spelling fix (Frontend se 'Password' aa raha hai)
        const hashed = await bcrypt.hash(Password || req.body.password, 10);

        const user = new usermodel({
            fullname,
            email,
            password: hashed,
            phone: phone || "Not Provided",
            address: address || "Not Provided",
            occupation: occupation || "Customer",
            govtIdType: govtIdType || "Aadhar", // Default values agar frontend se nahi aa rahi
            govtIdNumber: govtIdNumber || "N/A",
            role: 'user'
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error("🔥 Register Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

// 2. OWNER REGISTER (Updated)
async function ownerragister(req, res) {
    try {
        const { fullname, email, Password, phone, address, occupation, govtIdType, govtIdNumber } = req.body;

        const existing = await usermodel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Owner already exists' });

        const hashed = await bcrypt.hash(Password || req.body.password, 10);

        const user = new usermodel({
            fullname,
            email,
            password: hashed,
            phone,
            address,
            occupation,
            govtIdType,
            govtIdNumber,
            role: 'owner'
        });

        await user.save();
        res.status(201).json({ message: 'Owner account created successfully!' });
    } catch (err) {
        console.error("🔥 Owner Register Error:", err);
        res.status(500).json({ message: "Registration fail", error: err.message });
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

        const token = jwt.sign({ id: user._id, role: 'user' }, SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: 'Login successful', token, role: 'user', user });
    } catch (err) {
        console.error("🔥 Login Error:", err);
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

// 3. OWNER REGISTER
async function ownerragister(req, res) {
    try {
        // Frontend payload se saare fields nikaalein
        const { fullname, email, Password, phone, address, occupation, govtIdType, govtIdNumber } = req.body;

        // Validation
        if (!Password) return res.status(400).json({ message: "Password is required" });

        const existing = await usermodel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Owner already exists' });

        // Password hashing
        const hashed = await bcrypt.hash(Password, 10);

        // Naya user (owner role ke saath) create karein
        const newOwner = new usermodel({
            fullname,
            email,
            password: hashed, // Model mein 'password' hai, payload mein 'Password'
            phone,
            address,
            occupation,
            govtIdType,
            govtIdNumber,
            role: 'owner'
        });

        await newOwner.save();
        res.status(201).json({ message: 'Owner account created successfully!' });
    } catch (err) {
        console.error("🔥 Owner Register Error:", err);
        res.status(500).json({ message: "Registration fail", error: err.message });
    }
}

// 4. OWNER + ADMIN LOGIN
async function ownerlogin(req, res) {
    try {
        const { email, password } = req.body;

        if (email === 'admin@gmail.com' && password === 'admin123') {
            const token = jwt.sign({ id: 'ADMIN_SUPER_ID', role: 'admin' }, SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                message: 'Admin Login successful',
                token,
                role: 'admin',
                user: { fullname: "System Admin", email: "admin@gmail.com" }
            });
        }

        const user = await usermodel.findOne({ email, role: 'owner' });
        if (!user) return res.status(400).json({ message: 'Owner account nahi mila!' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Galat password!' });

        const token = jwt.sign({ id: user._id, role: 'owner' }, SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: 'Login successful', token, role: 'owner', user });
    } catch (err) {
        console.error("🔥 Owner Login Error:", err);
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

// 5. AGENT REGISTER
// AGENT REGISTER
// 5. AGENT REGISTER
// 5. AGENT REGISTER
// Check spelling: registerAgent (r-e-g-i-s-t-e-r)
async function registerAgent(req, res) {
    try {
        const { fullname, email, phone, address, occupation, govtIdType, govtIdNumber } = req.body;
        const pass = req.body.password || req.body.Password;

        if (!fullname || !email || !pass) {
            return res.status(400).json({ message: "Mandatory fields missing" });
        }

        const agent = new AgentModel({
            fullname,
            email,
            password: pass,
            phone,
            address,
            occupation,
            govtIdType,
            govtIdNumber
        });

        await agent.save();
        res.status(201).json({ message: "Agent registered! 🚀" });
    } catch (err) {
        console.error("🔥 Server Terminal Error:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

// File ke sabse niche check karein exports:
module.exports = {
    // ... baaki functions
    registerAgent, // spelling match honi chahiye upar wale function se
    loginAgent,
    // ...
};
// 6. AGENT LOGIN
async function loginAgent(req, res) {
    try {
        const { email, password } = req.body;

        // Agent ko database mein dhoondein
        const agent = await AgentModel.findOne({ email });
        if (!agent) return res.status(401).json({ message: "Invalid credentials" });

        // Model ka method ya bcrypt use karke password check karein
        const isMatch = await bcrypt.compare(password, agent.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // JWT Token generate karein
        const token = jwt.sign({ id: agent._id, role: 'agent' }, SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: "Login success",
            token,
            role: 'agent',
            user: agent
        });
    } catch (err) {
        console.error("🔥 Agent Login Error:", err);
        res.status(500).json({ message: "Login Error", error: err.message });
    }
}

// 7. DASHBOARD FETCHING
async function getAllUsers(req, res) {
    try {
        const users = await usermodel.find({ role: 'user' }).select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error("🔥 Get Users Error:", err);
        res.status(500).json({ message: "Users fetch error" });
    }
}

async function getAllOwners(req, res) {
    try {
        const owners = await usermodel.find({ role: 'owner' }).select('-password');
        res.status(200).json(owners);
    } catch (err) {
        console.error("🔥 Get Owners Error:", err);
        res.status(500).json({ message: "Owners fetch error" });
    }
}

async function getAllAgents(req, res) {
    try {
        const agents = await AgentModel.find().select('-password');
        res.status(200).json(agents);
    } catch (err) {
        console.error("🔥 Get Agents Error:", err);
        res.status(500).json({ message: "Agents fetch error" });
    }
}

// 8. LOGOUTS
async function logout(req, res) { res.status(200).json({ message: "Logout success" }); }
async function ownerlogout(req, res) { res.status(200).json({ message: "Owner logout success" }); }
async function agentLogout(req, res) { res.status(200).json({ message: "Agent logout success" }); }

module.exports = {
    register,
    login,
    logout,
    ownerragister,
    ownerlogin,
    ownerlogout,
    getAllUsers,
    getAllOwners,
    registerAgent,
    loginAgent,
    agentLogout,
    getAllAgents
};