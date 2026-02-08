const express = require('express');
const Router = express.Router(); // पक्का करें कि R कैपिटल है

// 1. इम्पोर्ट्स चेक करें
const authmiddleware = require('../middlewares/auth.middleware');
const venueController = require('../controllers/venue.controller');

// सेफ्टी चेक: अगर इनमें से कोई भी undefined है तो सर्वर यहीं बता देगा
if (typeof authmiddleware !== 'function') {
    console.error("❌ Error: authmiddleware is not a function. Check your middleware export!");
}

// 2. राउट्स को ध्यान से लिखें
// पक्का करें कि venueController.getOwnerVenues एक फंक्शन है
Router.get('/my-venues', authmiddleware, (req, res, next) => {
    if (typeof venueController.getOwnerVenues !== 'function') {
        return res.status(500).send("Controller function missing");
    }
    venueController.getOwnerVenues(req, res, next);
});

Router.post('/register', authmiddleware, venueController.createVenue);

Router.get('/all', venueController.getAllVenues);

// 3. सबसे जरूरी लाइन: Router को ही एक्सपोर्ट करें
module.exports = Router;