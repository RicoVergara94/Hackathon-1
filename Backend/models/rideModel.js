const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startingPoint: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  payment: { type: Number, required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;
