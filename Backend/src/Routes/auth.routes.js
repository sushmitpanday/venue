const Router = require('express').Router();
// 1. Pehle controller se naye functions ko yahan add kijiye
const {
    register,
    login,
    logout,
    ownerlogin,
    ownerlogout,
    ownerragister,
    getAllUsers,
    getAllOwners // <-- Ye naye functions import karein
} = require('../controllers/auth.controller');

const usermodel = require('../database/models/user.model');

// AUTH ROUTES
Router.post('/user/register', register);
Router.post('/user/login', login);
Router.get('/user/logout', logout);

// OWNER + HOTEL COMBINED ROUTE
Router.post('/owner/register', ownerragister);
Router.post('/owner/login', ownerlogin);
Router.get('/owner/logout', ownerlogout);

// --- ADMIN DASHBOARD ROUTES (Ye do lines add karein) ---

// Frontend yahan se 'Users' ki list lega
Router.get('/admin/users', getAllUsers);

// Frontend yahan se 'Owners' ki list lega
Router.get('/admin/owners', getAllOwners);


// GET ALL DATA (Jo aapne pehle banaya tha, ise debug ke liye rehne de sakte hain)
Router.get('/user/all', async(req, res) => {
    try {
        const users = await usermodel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
});

module.exports = Router;