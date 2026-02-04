const Venue = require('../database/models/venue.model');

async function createVenue(req, res) {
    console.log(req.owner);
    try {
        const venueData = req.body;
        venueData.owner = req.owner._id; // Associate venue with the authenticated owner
        const newVenue = new Venue(venueData);
        await newVenue.save();
        res.status(201).json(newVenue);
    } catch (error) {
        res.status(500).json({ message: 'Error creating venue', error });
    }
}

module.exports = { createVenue };