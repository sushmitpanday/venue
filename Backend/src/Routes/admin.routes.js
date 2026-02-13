// admin.routes.js
const express = require('express');
const router = express.Router();
const { getFilteredVenues } = require('../Controllers/adminfilter.controller');

// URL: /api/admin/filter-venues
router.get('/filter-venues', getFilteredVenues);

module.exports = router;