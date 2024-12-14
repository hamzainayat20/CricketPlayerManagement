const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const playerRoutes = require('./routes/playerroutes');

const app = express();
const PORT = 5000;

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/CricketPlayerManagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// Create MongoDB Session Store
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/CricketPlayerManagement',
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Session Middleware
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1-hour session expiration
    },
  })
);

// Serve static files (e.g., index.html)
app.use(express.static('public'));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Player Management API');
});

// Session Management Routes

// Set session data
app.post('/session/set', (req, res) => {
  const { key, value } = req.body;
  req.session[key] = value;
  res.json({ message: `Session key '${key}' set to '${value}'` });
});

// Get session data
app.get('/session/get', (req, res) => {
  const { key } = req.query;
  if (req.session[key]) {
    res.json({ key, value: req.session[key] });
  } else {
    res.status(404).json({ message: `Session key '${key}' not found` });
  }
});

// Update session data
app.put('/session/update', (req, res) => {
  const { key, value } = req.body;
  if (req.session[key]) {
    req.session[key] = value;
    res.json({ message: `Session key '${key}' updated to '${value}'` });
  } else {
    res.status(404).json({ message: `Session key '${key}' not found` });
  }
});

// Destroy session
app.delete('/session/destroy', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Error destroying session', error: err });
    } else {
      res.json({ message: 'Session destroyed successfully' });
    }
  });
});

// Check if a session exists
app.get('/session/check', (req, res) => {
  if (req.session) {
    res.json({ message: 'Session is active', session: req.session });
  } else {
    res.status(404).json({ message: 'No active session' });
  }
});

// Player Routes
app.use('/api/players', playerRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});