const emailService = require("./emailService");

const hasEmailConfig = emailService.hasEmailConfig;
const senderAddress = () => process.env.EMAIL_FROM || process.env.EMAIL_USER || "StayFinder <noreply@stayfinder.app>";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const buildBookingEmailHtml = ({ role, bookingDetails }) => {
  const isGuest = role === "guest";
  const title = isGuest ? "Booking Confirmed" : "New Booking Received";
  const intro = isGuest
    ? `Hello ${bookingDetails.name || "guest"},`
    : `Hello ${bookingDetails.hostName || "Host"},`;
  const leadText = isGuest
    ? "Your booking has been confirmed."
    : "You have received a new booking for your property.";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">
      <h2 style="color: #0f766e; margin-bottom: 12px;">${title}</h2>
      <p>${intro}</p>
      <p>${leadText}</p>
      <div style="background: #ffffff; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin-top: 0; color: #111827;">${bookingDetails.property}</h3>
        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId || "N/A"}</p>
        <p><strong>Check In:</strong> ${bookingDetails.checkIn}</p>
        <p><strong>Check Out:</strong> ${bookingDetails.checkOut}</p>
        <p><strong>Guests:</strong> ${bookingDetails.guests}</p>
        <p><strong>Total:</strong> ${formatCurrency(bookingDetails.total)}</p>
      </div>
      <p>Thank you for choosing StayFinder.</p>
      ${isGuest ? "" : "<p>Please log in to your StayFinder account to manage this booking.</p>"}
      <p>Thanks,<br><strong>StayFinder Team</strong></p>
    </div>
  `;
};

const sendBookingEmail = async ({ to, role, bookingDetails }) => {
  if (!hasEmailConfig()) {
    console.warn("Email credentials are not configured. Skipping booking email.");
    return;
  }

  const mailOptions = {
    from: senderAddress(),
    to,
    subject: role === "guest" ? "Booking Confirmed | StayFinder" : "New Booking Received | StayFinder",
    html: buildBookingEmailHtml({ role, bookingDetails }),
  };

  try {
    const result = await emailService.sendMail(mailOptions);
    console.log(`${role.toUpperCase()} EMAIL SENT SUCCESSFULLY:`, result);
  } catch (error) {
    console.error(`${role.toUpperCase()} EMAIL FAILED:`, error);

    if (process.env.NODE_ENV !== "production") {
      console.warn("Email sending failed. Check SMTP credentials or Resend domain verification.");
    }
  }
};

exports.sendBookingConfirmation = async (userEmail, bookingDetails) => {
  await sendBookingEmail({
    to: userEmail,
    role: "guest",
    bookingDetails,
  });
};

exports.sendHostNotification = async (hostEmail, bookingDetails) => {
  await sendBookingEmail({
    to: hostEmail,
    role: "host",
    bookingDetails,
  });
};

exports.buildBookingEmailHtml = buildBookingEmailHtml;
