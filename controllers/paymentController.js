const Razorpay = require("../config/razorpay");
const crypto = require("crypto");

const Home = require("../models/home");
const Booking = require("../models/booking");

const { sendBookingConfirmation } = require("../utils/sendEmail");

const getBookingPayload = (body) => {
  const payload = body?.bookingData || body || {};

  return {
    homeId: payload.homeId,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guests: payload.guests,
  };
};

exports.createOrder = async (req, res) => {
  try {
    const { homeId, checkIn, checkOut, guests } = getBookingPayload(req.body);

    if (!req.session?.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to complete your booking.",
      });
    }

    if (!homeId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details.",
      });
    }

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    if (home.host.toString() === req.session.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot book your own property.",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates.",
      });
    }

    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = nights * home.price;

    const options = {
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: `booking_${Date.now()}`,
      notes: {
        homeId,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      },
    };

    const order = await Razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      totalPrice,
      homeName: home.houseName,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const bookingData = getBookingPayload(req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    const { homeId, checkIn, checkOut, guests } = bookingData;

    if (!req.session?.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to complete your booking.",
      });
    }

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    if (home.host.toString() === req.session.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot book your own property.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = nights * home.price;

    const booking = new Booking({
      user: req.session.user._id,
      home: homeId,
      checkIn: start,
      checkOut: end,
      guests: Number(guests),
      totalPrice,
      bookingStatus: "Confirmed",
      paymentStatus: "Paid",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paymentSignature: razorpay_signature,
    });

    await booking.save();

    await sendBookingConfirmation(
      req.session.user.email,
      {
        name: req.session.user.firstName,
        property: home.houseName,
        checkIn,
        checkOut,
        guests,
        total: totalPrice,
      }
    );

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};