const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  startLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  endLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  totalMiles: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  payment: { type: Number, required: true },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

rideSchema.index({ startLocation: '2dsphere' });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
