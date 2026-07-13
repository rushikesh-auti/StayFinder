const Booking = require("../models/booking");
const Home = require("../models/home");

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.user._id })
      .populate("home")
      .sort({ createdAt: -1 });

    res.render("booking/booking-list", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      registeredHomes: [],
      favouriteHomes: [],
      bookings,
      user: req.session.user,
      isLoggedIn: req.session.isLoggedIn,
    });

  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.postBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;

    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.redirect("/homes");
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = nights * home.price;

    const booking = new Booking({
      user: req.session.user._id,
      home: home._id,
      checkIn: start,
      checkOut: end,
      guests,
      totalPrice,
    });

    await booking.save();

    res.redirect("/bookings");

  } catch (err) {
    console.log(err);
    res.redirect("/homes");
  }
};

exports.cancelBooking = async (req, res) => {
  try {

    await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        bookingStatus: "Cancelled",
      }
    );

    res.redirect("/bookings");

  } catch (err) {
    console.log(err);
    res.redirect("/bookings");
  }
};