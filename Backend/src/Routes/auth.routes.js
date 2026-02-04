const Router = require('express').Router();
const { register, login, logout, ownerlogin, ownerlogout, ownerragister } = require('../controllers/auth.controller');

// 1. Pehle model ko yahan import karein (Rasta check kar lein)
const usermodel = require('../database/models/user.model');

Router.post('/user/register', register);
Router.post('/user/login', login);
Router.get('/user/logout', logout);

Router.post('/owner/register', ownerragister);
Router.post('/owner/login', ownerlogin);
Router.get('/owner/logout', ownerlogout);

// 2. Ab ye route sahi se chalega
Router.get('/user/register', async(req, res) => {
    try {
        const users = await usermodel.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

module.exports = Router;