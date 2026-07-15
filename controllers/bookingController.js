const Booking = require("../models/booking");
const Home = require("../models/home");

const parseBookingDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const findBookingConflict = async (homeId, start, end) => {
  const existingBookings = await Booking.find({
    home: homeId,
    bookingStatus: "Confirmed",
  });

  return existingBookings.some((booking) => {
    const existingStart = new Date(booking.checkIn);
    const existingEnd = new Date(booking.checkOut);

    return existingStart < end && existingEnd > start;
  });
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.session.user._id,
    })
      .populate("home")
      .sort({ createdAt: -1 });

    bookings.forEach((booking) => {
      booking.nights = Math.ceil(
        (booking.checkOut - booking.checkIn) /
        (1000 * 60 * 60 * 24)
      );
    });

    res.render("store/bookings", {
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

exports.checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.status(404).json({ available: false, message: "Property not found." });
    }

    if (!checkIn || !checkOut) {
      return res.json({ available: false, message: "Please select dates." });
    }

    const start = parseBookingDate(checkIn);
    const end = parseBookingDate(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return res.json({ available: false, message: "Please select valid dates." });
    }

    const hasConflict = await findBookingConflict(home._id, start, end);

    return res.json({
      available: !hasConflict,
      message: hasConflict ? "Property is unavailable for selected dates." : "",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ available: false, message: "Unable to check availability right now." });
  }
};

exports.postBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;

    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.redirect("/homes");
    }

    const start = parseBookingDate(checkIn);
    const end = parseBookingDate(checkOut);

    const hasConflict = await findBookingConflict(home._id, start, end);

    if (hasConflict) {
      return res.render("store/home-detail", {
        home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        bookingError: "Property is unavailable for selected dates.",
      });
    }

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