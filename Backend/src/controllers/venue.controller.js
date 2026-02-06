const Venue = require('../database/models/venue.model');

async function createVenue(req, res) {
    try {
        console.log("Body received:", req.body); // Ye check karne ke liye ki data aa raha hai

        const venueData = req.body;

        // Agar middleware se user nahi mila, toh frontend wali ID use karein
        // Aur Model mein field ka naam 'ownerId' hai, isliye wahi use karein
        if (req.owner) {
            venueData.ownerId = req.owner._id;
        } else if (!venueData.ownerId) {
            return res.status(400).json({ message: "Owner ID is missing" });
        }

        const newVenue = new Venue(venueData);
        await newVenue.save();

        console.log("✅ Venue saved to Atlas");
        res.status(201).json(newVenue);
    } catch (error) {
        console.error("Error creating venue:", error);
        res.status(500).json({ message: 'Error creating venue', error: error.message });
    }
}

module.exports = { createVenue };