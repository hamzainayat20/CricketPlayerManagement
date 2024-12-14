const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stats: { type: Object },
  country: { type: String }
});

// Create the Player model
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
