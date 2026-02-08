const Venue = require('../database/models/venue.model');

// 1. Naya Hotel/Venue banane ke liye
const createVenue = async(req, res) => {
    try {
        const { name, location, price, description, contactNumber } = req.body;

        const newVenue = new Venue({
            name,
            location,
            price: Number(price),
            description,
            contactNumber,
            ownerId: req.owner._id // Ye authmiddleware se aa raha hai
        });

        await newVenue.save();
        res.status(201).json({ message: "Hotel registered successfully!", venue: newVenue });
    } catch (err) {
        res.status(500).json({ message: "Hotel registration failed", error: err.message });
    }
};

// 2. Sirf login kiye hue owner ke hotels dikhane ke liye
const getOwnerVenues = async(req, res) => {
    try {
        // req.owner._id wahi hai jo token se nikal raha hai
        const venues = await Venue.find({ ownerId: req.owner._id });
        res.status(200).json(venues);
    } catch (err) {
        res.status(500).json({ message: "Error fetching your venues", error: err.message });
    }
};

// 3. Sabhi venues dikhane ke liye (Customer side)
const getAllVenues = async(req, res) => {
    try {
        const venues = await Venue.find({});
        res.status(200).json(venues);
    } catch (err) {
        res.status(500).json({ message: "Error fetching venues", error: err.message });
    }
};

// Exports (Jo aapne pehle bheje the)
module.exports = {
    createVenue,
    getAllVenues,
    getOwnerVenues,
    getVenueById: (req, res) => {},
    updateVenue: (req, res) => {},
    deleteVenue: (req, res) => {}
};