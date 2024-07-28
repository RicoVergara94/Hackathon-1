const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  ratings: { type: Number, default: 0 },
  ridesGiven: { type: Number, default: 0 },
  ridesTaken: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
