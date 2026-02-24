const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
// verifyToken agar hai toh import karo, nahi toh hata dena niche se
const { verifyToken } = require('../middlewares/auth.middleware');

// 1. Checkout
router.post('/checkout', paymentController.checkout);

// 2. Verify (Idhar galti thi, maine fix kar di)
router.post('/verify', paymentController.verifyAndSave);

// 3. Admin: Get All
router.get('/all-payments', paymentController.getAllPayments);

module.exports = router;