const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/booking.middleware.js');
const Booking = require('../database/models/booking.model.js');

// Save Booking
router.post("/book", auth, async(req, res) => {
    try {
        const { venueId, bookingDate, amount, razorpay_payment_id } = req.body;
        const userEmail = req.user.email;

        const newBooking = new Booking({
            venueId,
            userEmail,
            date: bookingDate,
            paymentId: razorpay_payment_id,
            totalAmount: amount,
            status: "Confirmed"
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: "Venue Book Ho Gaya!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User Bookings
router.get("/my-bookings", auth, async(req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.user.email }).populate('venueId');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;