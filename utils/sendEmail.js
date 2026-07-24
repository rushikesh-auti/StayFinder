const transporter = require("./emailService");

const hasEmailConfig = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

exports.sendBookingConfirmation = async (
  userEmail,
  bookingDetails
) => {
  if (!hasEmailConfig()) {
    console.warn("Email credentials are not configured. Skipping booking confirmation email.");
    return;
  }

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
  if (!hasEmailConfig()) {
    console.warn("Email credentials are not configured. Skipping host notification email.");
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hostEmail,
    subject: "New Booking Received | StayFinder",

    html: `
      <h2>New Booking Received</h2>
      <p>You've received a new booking for your property.</p>
      <p><strong>Guest:</strong> ${booking.name}</p>
      <p><strong>Property:</strong> ${booking.property}</p>
      <p><strong>Check In:</strong> ${booking.checkIn}</p>
      <p><strong>Check Out:</strong> ${booking.checkOut}</p>
      <p><strong>Guests:</strong> ${booking.guests}</p>
      <p><strong>Total Amount:</strong> ₹${booking.total}</p>

      <br>
      <p>Please log in to your StayFinder account to manage this booking.</p>
      <p>Thanks,<br><strong>StayFinder Team</strong></p>
    `,
  };

  await transporter.sendMail(mailOptions);

};