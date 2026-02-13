const Venue = require('../database/models/venue.model');
const User = require('../database/models/user.model');
const Agent = require('../database/models/agent.model');

exports.getFilteredVenues = async(req, res) => {
    try {
        const { role } = req.query;

        // 1. Saare venues mangwao
        let venues = await Venue.find().lean();

        // 2. Manual Population Logic (Dono collections scan honge)
        const populatedVenues = await Promise.all(venues.map(async(v) => {
            if (!v.ownerId) return {...v, ownerId: null };

            // User check
            let owner = await User.findById(v.ownerId).select('role fullname email').lean();

            // Agent check
            if (!owner) {
                owner = await Agent.findById(v.ownerId).select('role fullname email').lean();
            }

            return {...v, ownerId: owner };
        }));

        // 3. Filtering Logic (Role-wise)
        let filteredResult = populatedVenues; // 'filtered' variable name clean kar diya

        if (role === 'admin') {
            filteredResult = populatedVenues.filter(v => !v.ownerId);
        } else if (role === 'agent') {
            filteredResult = populatedVenues.filter(v =>
                v.ownerId &&
                v.ownerId.role &&
                v.ownerId.role.toLowerCase().trim() === 'agent'
            );
        } else if (role === 'user') {
            filteredResult = populatedVenues.filter(v =>
                v.ownerId &&
                v.ownerId.role &&
                (v.ownerId.role.toLowerCase().trim() === 'user' || v.ownerId.role.toLowerCase().trim() === 'customer')
            );
        }

        // Backend Console Log
        console.log(`✅ Backend Sync -> Admin: ${populatedVenues.filter(v => !v.ownerId).length}, Agent: ${populatedVenues.filter(v => v.ownerId?.role === 'agent').length}, User: ${populatedVenues.filter(v => v.ownerId?.role === 'user').length}`);

        res.json(filteredResult);
    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};