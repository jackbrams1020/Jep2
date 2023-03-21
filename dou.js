// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Set up the express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define a User model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// Configure passport local strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password !== password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/workout-program', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Define API routes
app.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.send({ message: 'Login successful' });
  }
);

app.get('/exercises', (req, res) => {
  res.send({ exercises: ['Push-ups', 'Squats', 'Sit-ups'] });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
