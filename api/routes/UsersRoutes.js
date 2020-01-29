const express = require('express');
const bcrypt = require('bcryptjs');

// User Model
const User = require('../models/User');

const router = express.Router();

// @route POST /api/users
// @desc Create new user, add it in database
router.post('/', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  User.findOne({ login }).then(user => {
    if (user) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
      login,
      password
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          res.status(201).json({
            message: 'User created',
            user: {
              id: user.id,
              login: user.login
            }
          });
        });
      });
    });
  });
});

module.exports = router;
