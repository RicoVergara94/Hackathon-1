const express = require('express');
const router = express.Router();
const Ride = require('../models/rideModel');
const User = require('../models/userModel');

// Middleware to parse JSON bodies
router.use(express.json());

router.post('/create', async (req, res) => {
  try {
    const {
      startLocation,
      endLocation,
      totalMiles,
      seatsAvailable,
      payment,
      riderId,
    } = req.body;

    const rider = await User.findById(riderId);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    const newRide = new Ride({
      startLocation,
      endLocation,
      totalMiles,
      seatsAvailable,
      payment,
      rider: rider._id,
    });

    await newRide.save();
    res
      .status(201)
      .json({ message: 'Ride created successfully', ride: newRide });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
