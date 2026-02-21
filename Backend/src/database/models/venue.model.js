const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
    // agentId aur ownerId dono rakhe hain flexibility ke liye
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false // False rakha hai taaki direct Admin entries allow ho sakein
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Multiple images (Up to 5 recommended as per your Admin UI)
    images: [{
        type: String
    }],
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        tehsil: { type: String, trim: true },
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        default: 0
    },
    rooms: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);