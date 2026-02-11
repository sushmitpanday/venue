const Venue = require('../database/models/venue.model');

// 1. Naya Hotel/Venue banane ke liye
const createVenue = async(req, res) => {
    try {
        // 1. Pehle data nikalo
        const { name, location, price, description, contactNumber } = req.body;

        // 2. PHIR variable banao (Pehle ye line aayegi)
        const finalOwnerId = req.user ? (req.user._id || req.user.id) : "65f1a2b3c4d5e6f7a8b9c0d1";

        // 3. AB use use karo (Baad mein ye aayega)
        const newVenue = new Venue({
            name,
            location,
            price: Number(price),
            description,
            contactNumber,
            image: req.body.image || "",
            ownerId: finalOwnerId // <--- Ab ye sahi kaam karega
        });

        await newVenue.save();
        res.status(201).json({
            message: "Hotel registered successfully!",
            venue: newVenue
        });
    } catch (err) {
        console.error("❌ Create Venue Error:", err.message);
        res.status(500).json({
            message: "Hotel registration failed",
            error: err.message
        });
    }
};

// 2. Sirf login kiye hue owner ke hotels dikhane ke liye
const getOwnerVenues = async(req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // ownerId match kar rahe hain jo token se mila
        const venues = await Venue.find({ ownerId: req.user._id });
        res.status(200).json(venues);
    } catch (err) {
        console.error("❌ Fetch Owner Venues Error:", err.message);
        res.status(500).json({
            message: "Error fetching your venues",
            error: err.message
        });
    }
};

// 3. Sabhi venues dikhane ke liye (For Customer Side)
const getAllVenues = async(req, res) => {
    try {
        const venues = await Venue.find({});
        res.status(200).json(venues);
    } catch (err) {
        console.error("❌ Fetch All Venues Error:", err.message);
        res.status(500).json({
            message: "Error fetching venues",
            error: err.message
        });
    }
};

// 4. Update, Delete, GetById (Optional for now but kept to avoid errors)
const getVenueById = async(req, res) => { res.send("Get by ID logic here"); };
const updateVenue = async(req, res) => { res.send("Update logic here"); };
const deleteVenue = async(req, res) => { res.send("Delete logic here"); };

// SABSE IMPORTANT: Exports (Check spelling exactly with your Routes)
module.exports = {
    createVenue,
    getOwnerVenues,
    getAllVenues,
    getVenueById,
    updateVenue,
    deleteVenue
};