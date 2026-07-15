const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();

router.get("/", bookingController.getBookings);
router.get("/check-availability/:homeId", bookingController.checkAvailability);
router.post("/create/:homeId", bookingController.postBooking);
router.post("/cancel/:bookingId", bookingController.cancelBooking);

module.exports = router;