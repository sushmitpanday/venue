const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  photos: {
    type: [String], // array of image URLs or paths
    default: []
  },
  location: {
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableRooms: {
    type: Number,
    default: 1,
    min: 0
  },
  parkingAvailable: {
    type: Boolean,
    default: false
  },
  parkingDetails: {
    type: String
  },
  capacity: {
    type: Number
  },
  amenities: {
    type: [String],
    default: []
  },
  description: {
    type: String
  },
  isActive: {               
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// 2dsphere index for geospatial queries on location.coordinates
venueSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Venue', venueSchema);