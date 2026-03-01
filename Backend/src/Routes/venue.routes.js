const express = require('express');
const Router = express.Router();
const multer = require('multer'); // Naya import

// 1. इम्पोर्ट्स
const authmiddleware = require('../middlewares/auth.middleware');
const venueController = require('../controllers/venue.controller');

// --- MULTER SETUP (Sirf images handle karne ke liye) ---
// Memory storage zaroori hai taaki Sharp library use ho sake
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB per image
});

// सेफ्टी चेक
if (typeof authmiddleware !== 'function') {
    console.error("❌ Error: authmiddleware is not a function.");
}

// 2. राउट्स (Safe & Optimized)

// MY VENUES
Router.get('/my-venues', authmiddleware, (req, res, next) => {
    if (typeof venueController.getOwnerVenues !== 'function') {
        return res.status(500).send("Controller function missing");
    }
    venueController.getOwnerVenues(req, res, next);
});

// REGISTER (Yahan 'upload.array' add kiya hai images ke liye)
// 'images' woh field name hai jo aap frontend se bhejenge
Router.post('/register', authmiddleware, upload.array('images', 10), venueController.createVenue);

// GET ALL
Router.get('/all', venueController.getAllVenues);

// 3. DELETE Route
Router.delete('/:id', authmiddleware, venueController.deleteVenue);

// 4. EDIT/UPDATE Route (Yahan bhi images update ka option rakha hai)
Router.put('/:id', authmiddleware, upload.array('images', 10), venueController.updateVenue);

// 5. एक्सपोर्ट
module.exports = Router;