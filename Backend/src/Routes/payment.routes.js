const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const path = require('path');

// 1. Env config (Ab crash nahi hoga)
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 2. Order Creation Route
router.post("/order", async(req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: Math.round(Number(amount) * 100), // Rupee to Paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Frontend ko order data bhejo
        res.status(200).json({
            success: true,
            order
        });

    } catch (err) {
        console.error("Razorpay Error:", err);
        res.status(500).json({
            success: false,
            message: "Order creation failed",
            error: err.message
        });
    }
});

module.exports = router;