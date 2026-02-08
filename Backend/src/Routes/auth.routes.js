const Router = require('express').Router();
const { register, login, logout, ownerlogin, ownerlogout, ownerragister } = require('../controllers/auth.controller');
const usermodel = require('../database/models/user.model');

// AUTH ROUTES
Router.post('/user/register', register);
Router.post('/user/login', login);
Router.get('/user/logout', logout);

// OWNER + HOTEL COMBINED ROUTE
Router.post('/owner/register', ownerragister);
Router.post('/owner/login', ownerlogin);
Router.get('/owner/logout', ownerlogout);

// GET ALL USERS (For Admin/Debug)
Router.get('/user/all', async(req, res) => {
    try {
        const users = await usermodel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
});

module.exports = Router;