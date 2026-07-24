const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure =
  process.env.SMTP_SECURE === undefined
    ? smtpPort === 465
    : process.env.SMTP_SECURE === "true";

const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

const sendWithResend = async ({ from, to, subject, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) {
    throw new Error(`Resend email failed (${response.status}): ${await response.text()}`);
  }

  return response.json();
};

exports.hasEmailConfig = () =>
  Boolean(
    (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) ||
      (process.env.EMAIL_USER && process.env.EMAIL_PASS)
  );

exports.sendMail = async (mailOptions) => {
  if (process.env.RESEND_API_KEY) {
    return sendWithResend(mailOptions);
  }

  return smtpTransporter.sendMail(mailOptions);
};
