const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  riderId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  pickupNode: { type: String, required: true },
  dropoffNode: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['SEARCHING', 'MATCHED', 'COMPLETED', 'CANCELLED'], 
    default: 'SEARCHING' 
  },
  price: { type: Number },
  estimatedTime: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);