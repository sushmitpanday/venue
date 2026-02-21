const express = require('express');
const router = express.Router(); // Ye line missing thi
const { addVenueByAdmin } = require('../controllers/adminadd.controller');
const adminProtect = require('../../middlewares/adminadd.middleware');

// Sabse pehle GET route (Naya data dekhne ke liye)
router.get('/all', adminProtect, async(req, res) => {
    try {
        const AdminVenue = require('../database/models/adminadd.model');
        const data = await AdminVenue.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fir POST route (Naya data save karne ke liye)
router.post('/add', adminProtect, addVenueByAdmin);

module.exports = router; // Export sahi se hona chahiye