const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  status: { type: String, enum: ['AVAILABLE', 'ON_RIDE', 'OFFLINE'], default: 'AVAILABLE' },
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

driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);