const config = {
  expressPort: 8080,
  mongoURI: process.env.DOCKER_MONGO_URI || 'mongodb://localhost/leaderboard',
  jwtSecret: 'sl_myJwtSecret'
};

module.exports = config;
