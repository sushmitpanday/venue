const express = require('express');
const router = express.Router();
// Path check karo: Routes se ek folder bahar (src) phir controllers mein
const bookingController = require('../controllers/booking.controllder');
const authMiddleware = require('../../middlewares/booking.middleware');

router.post("/checkout", authMiddleware, bookingController.checkout);
router.post("/verify", authMiddleware, bookingController.verifyAndSave);

module.exports = router;