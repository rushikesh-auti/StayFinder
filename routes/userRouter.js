// core modules
const path = require('path');

// external modules
const express = require('express');
const userRouter = express.Router();

// local modules
const { registeredHomes } = require('./hostRouter');

userRouter.get('/', (req, res, next) => {
  console.log(registeredHomes);
  res.render('home', { registeredHomes, pageTitle: 'Airbnb Home' });
});

module.exports = userRouter;