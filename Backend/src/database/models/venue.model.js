const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false // <--- Ise false kar do, error turant band ho jayega
    },
    name: { type: String, required: true, trim: true },
    image: { type: String }, // <--- 'photos' ki jagah 'image' kar diya taaki controller se match ho
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true, trim: true },
        tehsil: { type: String, trim: true },
        state: { type: String, required: true, trim: true },
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);