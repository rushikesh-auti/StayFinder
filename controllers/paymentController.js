const Razorpay = require("../config/razorpay");
const crypto = require("crypto");

const Home = require("../models/home");
const Booking = require("../models/booking");

exports.createOrder = async (req, res) => {
  try {
    const { homeId, checkIn, checkOut, guests } = req.body;

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
      amount: totalPrice * 100,
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      homeId,
      checkIn,
      checkOut,
      guests,
    } = req.body;

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

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
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
      guests,
      totalPrice,
      bookingStatus: "Confirmed",
      paymentStatus: "Paid",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paymentSignature: razorpay_signature,
    });

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};