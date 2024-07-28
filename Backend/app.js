const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
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

// Routes
app.get('/', (req, res) => {
  res.send('This Hackathon sucks');
});

// const createUser = async (username, password) => {
//   try {
//     const user = new User({ username, password });
//     await user.save();
//     console.log('User created:', user);
//   } catch (error) {
//     console.error('Error creating user:', error);
//   }
// };

// createUser('Oscar Vergara', 'oscarpassword');

// app.post('/api/auth/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     console.log('Plain password:', password);
//     console.log('Hashed password from DB:', user.password);

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         message: `Invalid credentials ${username} ${password} ${user.password}`,
//       });
//     }

//     res.json({ message: 'Login successful' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

app.listen(port, () => {
  console.log('server is running on http://localhost:${port}');
});
