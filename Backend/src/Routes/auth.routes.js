const express = require('express');
const Router = express.Router();
const authController = require('../controllers/auth.controller');

// Destructuring functions from controller
const {
    register,
    login,
    logout,
    ownerlogin,
    ownerlogout,
    ownerragister, // Spelling check kar: 'ragister' ya 'register'?
    getAllUsers,
    getAllOwners,
    registerAgent,
    loginAgent,
    agentLogout,
    getAllAgents
} = authController;

// Pehle check kar ki koi function undefined toh nahi hai
// Agar undefined hogi toh console mein error dikhega crash hone se pehle
if (!registerAgent || !ownerragister) {
    console.error("❌ ERROR: Some controller functions are UNDEFINED. Check auth.controller.js exports.");
}

// 1. CUSTOMER (USER) ROUTES
Router.post('/user/register', register);
Router.post('/user/login', login);
Router.get('/user/logout', logout);

// 2. OWNER ROUTES
Router.post('/owner/register', ownerragister);
Router.post('/owner/login', ownerlogin);
Router.get('/owner/logout', ownerlogout);

// 3. AGENT ROUTES
Router.post('/agent/register', registerAgent);
Router.post('/agent/login', loginAgent);
Router.get('/agent/logout', agentLogout);

// 4. ADMIN DASHBOARD ROUTES
Router.get('/admin/users', getAllUsers);
Router.get('/admin/owners', getAllOwners);
Router.get('/admin/agents', getAllAgents);

module.exports = Router;