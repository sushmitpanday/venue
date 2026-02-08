const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'user', // <--- Isko small 'user' kar diya taaki usermodel se match ho
        required: true
    },
    name: { type: String, required: true, trim: true },
    photos: { type: [String], default: [] },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true, trim: true },
        tehsil: { type: String, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, default: "India" },
        coordinates: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }
        }
    },
    price: { type: Number, required: true, min: 0 },
    availableRooms: { type: Number, default: 1, min: 0 },
    parkingAvailable: { type: Boolean, default: false },
    capacity: { type: Number },
    amenities: { type: [String], default: [] },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

venueSchema.index({ 'location.coordinates': '2dsphere' });
venueSchema.index({ 'location.city': 'text', 'location.tehsil': 'text', 'name': 'text' });

module.exports = mongoose.model('Venue', venueSchema);