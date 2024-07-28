const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

// Replace `mydatabase` with your actual database name
const dbURI = 'mongodb://localhost:27017/ridedatabase';

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

// Routes
app.get('/', (req, res) => {
  res.send('This Hackathon sucks');
});

app.listen(port, () => {
  console.log('server is running on http://localhost:${port}');
});
