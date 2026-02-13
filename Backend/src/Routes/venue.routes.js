const express = require('express');
const Router = express.Router();

// 1. इम्पोर्ट्स
const authmiddleware = require('../middlewares/auth.middleware');
const venueController = require('../controllers/venue.controller');

// सेफ्टी चेक
if (typeof authmiddleware !== 'function') {
    console.error("❌ Error: authmiddleware is not a function.");
}

// 2. पुराने राउट्स (Inme koi badlav nahi)
Router.get('/my-venues', authmiddleware, (req, res, next) => {
    if (typeof venueController.getOwnerVenues !== 'function') {
        return res.status(500).send("Controller function missing");
    }
    venueController.getOwnerVenues(req, res, next);
});

Router.post('/register', authmiddleware, venueController.createVenue);
Router.get('/all', venueController.getAllVenues);

// --- NAYE ROUTES (Sirf ye 2 lines add ki hain) ---

// 3. DELETE Route: Kisi bhi dashboard se hatane ke liye
Router.delete('/:id', authmiddleware, venueController.deleteVenue);

// 4. EDIT/UPDATE Route: Data badalne ke liye
Router.put('/:id', authmiddleware, venueController.updateVenue);

// 5. एक्सपोर्ट
module.exports = Router;