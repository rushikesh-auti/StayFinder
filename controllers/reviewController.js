const Review = require("../models/review");
const Booking = require("../models/booking");
const Home = require("../models/home");

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const homeId = req.params.homeId;
    const userId = req.session.user._id;

    // check completed booking
    const booking = await Booking.findOne({
      user: userId,
      home: homeId,
      bookingStatus: "Confirmed",
      checkOut: { $lt: new Date() },
    });

    if (!booking) {
      return res.status(403).send("You can review only after completing a stay.");
    }

    // prevent duplicate review
    const existingReview = await Review.findOne({
      user: userId,
      home: homeId,
    });

    if (existingReview) {
      return res.status(400).send("You have already reviewed this property.");
    }

    await Review.create({
      home: homeId,
      user: userId,
      rating,
      comment,
    });

    const reviews = await Review.find({ home: homeId });
    const average =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Home.findByIdAndUpdate(homeId, {
      averageRating: average.toFixed(1),
      reviewCount: reviews.length,
    });

    res.redirect(`/homes/${homeId}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/homes/${req.params.homeId}`);
  }
};