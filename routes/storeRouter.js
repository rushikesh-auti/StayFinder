// External Module
const express = require('express');
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/booking", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);
storeRouter.post("/favourites", storeController.postAddToFavourite);


module.exports = storeRouter; 