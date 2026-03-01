const Venue = require('../database/models/venue.model');
const sharp = require('sharp'); // npm install sharp zaroor kar lena
const path = require('path');
const fs = require('fs');

// 1. CREATE: Bas images ko WebP banayega, baaki logic same hai
const createVenue = async(req, res) => {
    try {
        const { name, location, price, description, contactNumber, capacity, rooms } = req.body;
        const finalOwnerId = req.user ? (req.user._id || req.user.id) : "65f1a2b3c4d5e6f7a8b9c0d1";

        let imagePaths = [];

        // Image Processing Logic
        if (req.files && req.files.length > 0) {
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const processImages = req.files.map(async(file) => {
                const fileName = `venue-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
                const filePath = path.join(uploadDir, fileName);

                await sharp(file.buffer)
                    .webp({ quality: 80 }) // Format change
                    .toFile(filePath);

                return `/uploads/${fileName}`;
            });
            imagePaths = await Promise.all(processImages);
        }

        const newVenue = new Venue({
            name,
            location,
            price: Number(price),
            description,
            contactNumber,
            images: imagePaths.length > 0 ? imagePaths : (req.body.images || []),
            ownerId: finalOwnerId,
            capacity: Number(capacity) || 0,
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

// 2. GET OWNER VENUES (Wahi logic, bas .lean() lagaya hai speed ke liye)
const getOwnerVenues = async(req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const venues = await Venue.find({ ownerId: req.user._id }).lean();
        res.status(200).json(venues);
    } catch (err) {
        console.error("❌ Fetch Owner Venues Error:", err.message);
        res.status(500).json({ message: "Error fetching your venues", error: err.message });
    }
};

// 3. GET ALL VENUES
const getAllVenues = async(req, res) => {
    try {
        const venues = await Venue.find({}).populate('ownerId').lean();
        res.status(200).json(venues);
    } catch (err) {
        console.error("❌ Fetch All Venues Error:", err.message);
        res.status(500).json({ message: "Error fetching venues", error: err.message });
    }
};

// 4. UPDATE VENUE (Same logic)
const updateVenue = async(req, res) => {
    try {
        const { id } = req.params;
        const updatedVenue = await Venue.findByIdAndUpdate(id, req.body, { new: true }).lean();
        if (!updatedVenue) return res.status(404).json({ message: "Venue nahi mila" });

        res.status(200).json({ message: "Venue updated successfully!", venue: updatedVenue });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// 5. DELETE VENUE (Same logic)
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

const getVenueById = async(req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).lean();
        if (!venue) return res.status(404).json({ message: "Not found" });
        res.status(200).json(venue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createVenue,
    getOwnerVenues,
    getAllVenues,
    getVenueById,
    updateVenue,
    deleteVenue
};