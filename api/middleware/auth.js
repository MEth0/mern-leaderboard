const config = require('../config');
const jwt = require('jsonwebtoken');

// Auth middleware, check if user is logged in
function auth(req, res, next) {
  var token = req.cookies.get('JSESSIONID');
  if (!token) {
    res.status(200).json({ connected: false });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    // Add user to payload
    req.user = decoded;
    // Go to next function
    next();
  } catch (e) {
    res.status(400).json({ connected: false, message: 'Token is not valid' });
  }
}

module.exports = auth;
