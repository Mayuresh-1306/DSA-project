const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  riderId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  pickupNode: { type: String, required: true },
  dropoffNode: { type: String, required: true },
  pickupCoords: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number]
  },
  status: {
    type: String,
    enum: ['SEARCHING', 'MATCHED', 'COMPLETED', 'CANCELLED'],
    default: 'SEARCHING'
  },
  price: { type: Number },
  estimatedTime: { type: Number },          // minutes
  routeDistance: { type: Number },           // km
  routePath: [{ type: String }],            // ordered node IDs
  surgeMultiplier: { type: Number, default: 1.0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Ride', rideSchema);