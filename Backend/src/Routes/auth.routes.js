const Router = require('express').Router();
// FIX: 'ownerragister' ki spelling check karein (Aapne controller mein kya likhi hai?)
// Agar controller mein 'ownerragister' hai toh theek, warna 'ownerregister' karein.
const { register, login, logout, ownerlogin, ownerlogout, ownerragister } = require('../controllers/auth.controller');

const usermodel = require('../database/models/user.model');

// POST Routes (Data bhejane ke liye)
Router.post('/user/register', register);
Router.post('/user/login', login);
Router.get('/user/logout', logout);

Router.post('/owner/register', ownerragister);
Router.post('/owner/login', ownerlogin);
Router.get('/owner/logout', ownerlogout);

// GET Route (Frontend par data load karne ke liye)
Router.get('/user/register', async(req, res) => {
    try {
        // Hamesha find() ke sath exec() ya await use karein
        const users = await usermodel.find({});
        console.log("Users found:", users.length); // Debugging ke liye
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch Route Error:", error);
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
});

module.exports = Router;