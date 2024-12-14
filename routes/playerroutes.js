const express = require('express');
const Player = require('../models/player');
const router = express.Router();

// Add a player
router.post('/add', async (req, res) => {
  const { id, name, stats, country } = req.body;
  try {
    const newPlayer = new Player({ id, name, stats, country });
    await newPlayer.save();
    res.status(201).json({ message: 'Player added successfully', player: newPlayer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding player', error });
  }
});

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching players', error });
  }
});

// Update a player
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, stats, country } = req.body;
  try {
    const updatedPlayer = await Player.findOneAndUpdate({ id }, { name, stats, country }, { new: true });
    res.status(200).json({ message: 'Player updated successfully', player: updatedPlayer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating player', error });
  }
});

// Delete a player
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Player.findOneAndDelete({ id });
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting player', error });
  }
});

module.exports = router;