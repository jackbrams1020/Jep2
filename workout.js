const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

router.get('/workout', async (req, res) => {
  // get user input from request parameters or body
  const { fitnessLevel, equipment, exerciseTypes } = req.query;

  // query the database for workout routines that match user preferences
  const workouts = await Workout.find({
    difficulty: fitnessLevel,
    equipment: equipment,
    exerciseTypes: { $all: exerciseTypes }
  });

  // randomly select a workout from the list of matching routines
  const randomIndex = Math.floor(Math.random() * workouts.length);
  const workout = workouts[randomIndex];

  // send the selected workout as a response
  res.send(workout);
});

module.exports = router;
