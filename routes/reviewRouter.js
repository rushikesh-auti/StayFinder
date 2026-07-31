const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/:homeId", reviewController.addReview);

module.exports = router;