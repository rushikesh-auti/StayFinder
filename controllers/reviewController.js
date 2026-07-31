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
      req.session.reviewError = "You can review only after completing a stay.";
      return res.redirect(`/homes/${homeId}`);
    }

    // prevent duplicate review
    const existingReview = await Review.findOne({
      user: userId,
      home: homeId,
    });

    if (existingReview) {
      req.session.reviewError = "You have already reviewed this property.";
      return res.redirect(`/homes/${homeId}`);
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
    req.session.reviewError = "We couldn't submit your review. Please try again.";
    res.redirect(`/homes/${req.params.homeId}`);
  }
};
