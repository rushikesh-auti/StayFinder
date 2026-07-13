const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();

router.get("/", bookingController.getBookings);
router.post("/create/:homeId", bookingController.postBooking);
router.post("/cancel/:bookingId", bookingController.cancelBooking);

module.exports = router;