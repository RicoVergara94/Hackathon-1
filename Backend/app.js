const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const User = require('./models/userModel');
require('dotenv').config();

// Replace `mydatabase` with your actual database name
const dbURI = 'mongodb://localhost:27017/ridedatabase';

// Use the cors middleware to enable CORS
app.use(cors());

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const db = mongoose.connection;

db.on('error', err => {
  console.error('Connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth/', authRoutes);
app.use('/api/rides', rideRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('This Hackathon rocks');
});

app.get('/api/rides', async (req, res) => {
  try {
    const { startingPoint, destination } = req.query;
    const rides = await Ride.find({ startingPoint, destination });
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/rides', async (req, res) => {
  try {
    const {
      driver,
      startingPoint,
      destination,
      departureTime,
      availableSeats,
      payment,
    } = req.body;
    const ride = new Ride({
      driver,
      startingPoint,
      destination,
      departureTime,
      availableSeats,
      payment,
    });
    await ride.save();
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/rides/:id/request', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (ride.availableSeats > 0) {
      ride.passengers.push(req.body.userId);
      ride.availableSeats -= 1;
      await ride.save();
      res.status(200).json(ride);
    } else {
      res.status(400).json({ message: 'No available seats' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log('server is running on http://localhost:${port}');
});
