const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookies');
const path = require('path');
const config = require('./config');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookies.express([config.jwtSecret]));

const port = config.expressPort;
const db = config.mongoURI;

mongoose.connect(db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

router.use('/auth', require('./routes/AuthRoutes'));
router.use('/users', require('./routes/UsersRoutes'));
router.use('/teams', require('./routes/TeamsRoutes'));

app.use('/api', router);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  console.log('Production');
  // Set static folder
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Started on http://localhost:${port}`));
