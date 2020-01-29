const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const auth = require('../middleware/auth.js');

// User Model
const User = require('../models/User');

const router = express.Router();

// @route POST /api/auth/login
// @desc Sign in a user, set cookie with token
router.post('/login', (req, res) => {

  const { login, password } = req.body;
  if (!login | !password) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }

  User.findOne({ login }).then(user => {
    if (!user) return res.status(400).json({ message: 'User Does not exist' });

    // Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.cookies.set('JSESSIONID', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          httpOnly: true,
          sameSite: true,
          signed: false
        });
        res.status(200).json({
          message: 'Connected',
          user: {
            id: user.id,
            login: user.login
          }
        });
      });
    });
  });

});

// @route POST /api/auth/logout
// @desv Log out a user, remove cookie
router.post('/logout', (req, res) => {

  res.cookies.set('JSESSIONID');
  res.status(200).send({ message: 'Logout successful.' });

});

// @route GET /api/auth/me
// @desc Get info about connected user
// Private route, request pass to auth middleware to check if the user is logged in
router.get('/me', auth, (req, res) => {

  User.findById(req.user.id).select('-password').then(user => {
    res.status(200).json({ connected: true, user });
  });

});

module.exports = router;
