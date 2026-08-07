const Booking = require("../models/booking");
const Home = require("../models/home");
const mongoose = require("mongoose");
const { sendBookingConfirmation, sendHostNotification } = require("../utils/sendEmail");

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

    const validBookings = bookings.filter(
      (booking) => booking.home
    );

    validBookings.forEach((booking) => {
      booking.nights = Math.ceil(
        (booking.checkOut - booking.checkIn) /
        (1000 * 60 * 60 * 24)
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      booking.canCancel =
        booking.bookingStatus === "Confirmed" &&
        new Date(booking.checkIn) > today;
    });

    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      registeredHomes: [],
      favouriteHomes: [],
      bookings: validBookings,
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
      return res.status(404).json({
        available: false,
        message: "Property not found.",
      });
    }

    if (!checkIn || !checkOut) {
      return res.json({
        available: false,
        message: "Please select dates.",
      });
    }

    const start = parseBookingDate(checkIn);
    const end = parseBookingDate(checkOut);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start >= end
    ) {
      return res.json({
        available: false,
        message: "Please select valid dates.",
      });
    }

    const hasConflict = await findBookingConflict(
      home._id,
      start,
      end
    );

    return res.json({
      available: !hasConflict,
      message: hasConflict
        ? "Property is unavailable for selected dates."
        : "",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      available: false,
      message: "Unable to check availability right now.",
    });
  }
};

exports.postBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;

    const home = await Home.findById(req.params.homeId).populate("host");

    if (!home) {
      req.flash("error", "Property not found.");
      return res.redirect("/homes");
    }

    if (req.session.user.userType === "host") {
      return res.render("store/home-detail", {
        home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        bookingError: "Hosts cannot book properties.",
      });
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

    const notificationTasks = [
      sendBookingConfirmation(req.session.user.email, {
        name: req.session.user.firstName,
        property: home.houseName,
        checkIn: checkIn,
        checkOut: checkOut,
        guests,
        total: totalPrice,
        bookingId: booking._id.toString(),
      }),
    ];

    if (home.host?.email) {
      notificationTasks.push(
        sendHostNotification(home.host.email, {
          name: req.session.user.firstName,
          property: home.houseName,
          checkIn: checkIn,
          checkOut: checkOut,
          guests,
          total: totalPrice,
          bookingId: booking._id.toString(),
          hostName: home.host.firstName || "Host",
        })
      );
    } else {
      console.warn("Host email not available; skipping host notification.");
    }

    void Promise.allSettled(notificationTasks);

    req.flash("success", "Booking created successfully.");
    res.redirect("/bookings");
  } catch (err) {
    console.log(err);
    res.redirect("/homes");
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/bookings");
    }

    if (booking.user.toString() !== req.session.user._id.toString()) {
      req.flash("error", "You cannot cancel this booking.");
      return res.redirect("/bookings");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(booking.checkIn);

    if (checkInDate <= today) {
      req.flash("error", "This booking cannot be cancelled anymore.");
      return res.redirect("/bookings");
    }

    booking.bookingStatus = "Cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully.");
    res.redirect("/bookings");
  } catch (err) {
    console.log(err);
    res.redirect("/bookings");
  }
};

exports.getHostBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "home",
        populate: {
          path: "host",
        },
      })
      .populate("user")
      .sort({ createdAt: -1 });

    const hostBookings = bookings.filter((booking) => {
      return (
        booking.home &&
        booking.home.host &&
        booking.home.host._id.toString() ===
        req.session.user._id.toString()
      );
    });

    hostBookings.forEach((booking) => {
      booking.nights = Math.ceil(
        (booking.checkOut - booking.checkIn) /
        (1000 * 60 * 60 * 24)
      );
    });

    const totalBookings = hostBookings.length;

    const confirmedBookings = hostBookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    ).length;

    const cancelledBookings = hostBookings.filter(
      (booking) => booking.bookingStatus === "Cancelled"
    ).length;

    const totalRevenue = hostBookings
      .filter((booking) => booking.bookingStatus === "Confirmed")
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.render("host/host-bookings", {
      pageTitle: "Manage Bookings",
      currentPage: "host-bookings",
      bookings: hostBookings,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/host/host-home-list");
  }
};

exports.getBookedDates = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.homeId)) {
      return res.status(400).json([]);
    }

    const bookings = await Booking.find({
      home: req.params.homeId,
      bookingStatus: "Confirmed",
    });

    const disabledDates = [];
    bookings.forEach((booking) => {

      let current = new Date(booking.checkIn);
      while (current < booking.checkOut) {
        disabledDates.push(
          current.toISOString().split("T")[0]
        );
        current.setDate(current.getDate() + 1);
      }

    });
    res.json(disabledDates);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);

  }
};

exports.getBookingSuccess = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("home")
      .populate("user");

    if (!booking) {
      return res.redirect("/bookings");
    }

    if (booking.user._id.toString() !== req.session.user._id.toString()) {
      return res.redirect("/bookings");
    }

    const nights = Math.ceil(
      (booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24)
    );

    res.render("store/booking-success", {
      pageTitle: "Booking Confirmed",
      currentPage: "bookings",
      booking,
      nights,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/bookings");
  }
};