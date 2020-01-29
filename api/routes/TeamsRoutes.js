const express = require('express');
const auth = require('../middleware/auth.js');

// User Model
const Team = require('../models/Team');

const router = express.Router();

// @route GET /api/teams/:id
// @desc Get team info
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Team.findOne({ team: id }).then(team => {
    if (!team) return res.status(400).json({ message: 'Team Does not exist' });

    res.status(200).json(team);
  });
});

// @route GET /api/teams/all/leader
// @desc Get current leader score
router.get('/all/leader', (req, res) => {
  Team.find().sort({ score: -1 }).limit(1).then((team) => {
    res.status(200).json({ team: team[0] });
  });
});

// @route POST /api/teams/:id/add/:pts
// @desc Edit points of a team
// Private route
router.post('/:id/add/:pts', auth, (req, res) => {
  const { id, pts } = req.params;

  if (isNaN(pts)) {
    return res.status(400).json({ error: 'Points should be a number' })
  }
  Team.findOne({ team: id }).then(team => {
    if (!team) return res.status(400).json({ message: 'Team Does not exist' });
    team.score += parseInt(pts);
    team.save().then(() => {
      res.status(200).json({ message: 'Score updated' });
    });
  });
});

module.exports = router;
