// core modules
const path = require('path');

// exteranl module
const express = require('express');
const hostRouter = express.Router();

// local module
const rootDir = require('../utils/pathUtils');


hostRouter.get('/add-home', (req, res, next) => {
  res.render('addHome', { pageTitle: 'Add Home' });
});

const registeredHomes = [];

hostRouter.post('/add-home', (req, res, next) => {
  console.log(req.body);
  registeredHomes.push({
    homeName: req.body.homeName,
    location: req.body.location,
  });

  res.render('homeAdded', { pageTitle: 'Home Added' });

});

exports.hostRouter = hostRouter;
exports.registeredHomes = registeredHomes;
