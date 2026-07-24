const transporter = require("./emailService");

exports.sendBookingConfirmation = async (
  userEmail,
  bookingDetails
) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Booking Confirmed | StayFinder",

    html: `
      <h2>Booking Confirmed</h2>
      <p>Hello ${bookingDetails.name},</p>
      <p>Your booking has been confirmed.</p>
      <hr>
      <h3>${bookingDetails.property}</h3>
      <p><strong>Check In:</strong> ${bookingDetails.checkIn}</p>
      <p><strong>Check Out:</strong> ${bookingDetails.checkOut}</p>
      <p><strong>Guests:</strong> ${bookingDetails.guests}</p>
      <p><strong>Total:</strong> ₹${bookingDetails.total}</p>
      <br>
      <p>Thank you for choosing StayFinder</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendHostNotification = async (
  hostEmail,
  booking
) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hostEmail,
    subject: "New Booking Received",

    html: `
      <h2>Congratulations!</h2>
      <p>You have received a new booking.</p>
      <p><strong>Guest:</strong> ${booking.name}</p>
      <p><strong>Property:</strong> ${booking.property}</p>
      <p><strong>Check In:</strong> ${booking.checkIn}</p>
      <p><strong>Check Out:</strong> ${booking.checkOut}</p>
    `,
  };

  await transporter.sendMail(mailOptions);

};