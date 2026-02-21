const AdminVenue = require('../database/models/adminadd.model');

exports.addVenueByAdmin = async(req, res) => {
    try {
        const { name, price, description, location, images } = req.body;

        const newVenue = new AdminVenue({
            name,
            price,
            description,
            location,
            images
        });

        await newVenue.save();
        res.status(201).json({ success: true, message: "Venue added by Admin!", data: newVenue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};