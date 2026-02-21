const Venue = require('../database/models/venue.model');

// 1. Naya Hotel/Venue banane ke liye
const createVenue = async(req, res) => {
    try {
        const { name, location, price, description, contactNumber, images, capacity, rooms } = req.body;
        const finalOwnerId = req.user ? (req.user._id || req.user.id) : "65f1a2b3c4d5e6f7a8b9c0d1";

        const newVenue = new Venue({
            name,
            location,
            price: Number(price),
            description,
            contactNumber,
            images: images || [],
            ownerId: finalOwnerId,
            capacity: Number(capacity) || 0, // 2. Yahan add kiya (Number mein convert karke)
            rooms: Number(rooms) || 0
        });

        await newVenue.save();
        res.status(201).json({
            message: "Hotel registered successfully!",
            venue: newVenue
        });
    } catch (err) {
        console.error("❌ Create Venue Error:", err.message);
        res.status(500).json({ message: "Hotel registration failed", error: err.message });
    }
};

// 2. Sirf login kiye hue owner ke hotels dikhane ke liye
const getOwnerVenues = async(req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const venues = await Venue.find({ ownerId: req.user._id });
        res.status(200).json(venues);
    } catch (err) {
        console.error("❌ Fetch Owner Venues Error:", err.message);
        res.status(500).json({ message: "Error fetching your venues", error: err.message });
    }
};

// 3. Sabhi venues dikhane ke liye (With Populate)
const getAllVenues = async(req, res) => {
    try {
        const venues = await Venue.find({}).populate('ownerId');
        res.status(200).json(venues);
    } catch (err) {
        console.error("❌ Fetch All Venues Error:", err.message);
        res.status(500).json({ message: "Error fetching venues", error: err.message });
    }
};

// 4. UPDATE VENUE (Ab real logic hai)
const updateVenue = async(req, res) => {
    try {
        const { id } = req.params;
        // Body se naya data lo aur update karo
        const updatedVenue = await Venue.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedVenue) return res.status(404).json({ message: "Venue nahi mila" });

        res.status(200).json({ message: "Venue updated successfully!", venue: updatedVenue });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// 5. DELETE VENUE (Ab real logic hai)
const deleteVenue = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedVenue = await Venue.findByIdAndDelete(id);
        if (!deletedVenue) return res.status(404).json({ message: "Venue already deleted" });

        res.status(200).json({ message: "Venue deleted from everywhere!" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

const getVenueById = async(req, res) => { res.send("Get by ID logic here"); };

// SABSE IMPORTANT: Exports
module.exports = {
    createVenue,
    getOwnerVenues,
    getAllVenues,
    getVenueById,
    updateVenue,
    deleteVenue
};