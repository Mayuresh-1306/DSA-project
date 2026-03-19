const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rating: { type: Number, default: 4.5, min: 1.0, max: 5.0 },
  status: {
    type: String,
    enum: ['AVAILABLE', 'ON_RIDE', 'OFFLINE'],
    default: 'AVAILABLE'
  },
  vehicleType: {
    type: String,
    enum: ['auto', 'sedan', 'suv', 'bike'],
    default: 'sedan'
  },
  totalRides: { type: Number, default: 0 },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// 2dsphere index enables O(log N) geospatial queries
driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);