const Router = require('express').Router();
const { createVenue, getAllVenues, getVenueById, updateVenue, deleteVenue } = require('../controllers/venue.controller');

// Isse aapka user registration (Name/Email) kharab nahi hoga 
// Kyunki wo 'auth' routes mein hota hai
Router.post('/register', createVenue);

module.exports = Router;