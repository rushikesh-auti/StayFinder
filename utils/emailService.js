const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure =
  process.env.SMTP_SECURE === undefined
    ? smtpPort === 465
    : process.env.SMTP_SECURE === "true";

const smtpTransporter = process.env.SMTP_URL
  ? nodemailer.createTransport(process.env.SMTP_URL)
  : nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: smtpPort,
    secure: smtpSecure,
    auth: process.env.EMAIL_USER && process.env.EMAIL_PASS
      ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
      : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

const hasSmtpConfig = (env = process.env) => Boolean(env.SMTP_HOST && env.EMAIL_USER && env.EMAIL_PASS);
const hasResendConfig = (env = process.env) => Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
const hasFallbackRecipient = (env = process.env) => Boolean(env.EMAIL_FALLBACK_RECIPIENT || env.EMAIL_USER);
const isResendVerified = (env = process.env) => Boolean(env.RESEND_DOMAIN_VERIFIED === "true" || env.RESEND_USE === "true");

const getFallbackRecipient = (env = process.env, originalRecipient) => {
  const fallbackCandidates = [
    env.EMAIL_FALLBACK_RECIPIENT,
    env.EMAIL_USER,
  ].filter(Boolean);

  return fallbackCandidates.find((candidate) => candidate?.toLowerCase() !== originalRecipient?.toLowerCase()) || null;
};

const isResendSandboxError = (responseText = "") => /only send testing emails|validation_error|verify a domain/i.test(responseText);

const resolveEmailTransport = (env = process.env) => {
  if (hasSmtpConfig(env) || Boolean(env.SMTP_URL && env.EMAIL_USER && env.EMAIL_PASS)) {
    return "smtp";
  }

  if (hasResendConfig(env) && (isResendVerified(env) || hasFallbackRecipient(env))) {
    return "resend";
  }

  return "none";
};

const sendWithResend = async (mailOptions, isFallback = false) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailOptions),
  });

  const responseText = await response.text();

  if (!response.ok) {
    if (!isFallback && isResendSandboxError(responseText)) {
      const fallbackRecipient = getFallbackRecipient(process.env, mailOptions.to);

      if (fallbackRecipient) {
        console.warn(`Resend sandbox restriction triggered. Forwarding email to ${fallbackRecipient}.`);

        return sendWithResend(
          {
            ...mailOptions,
            to: fallbackRecipient,
            subject: `[Forwarded] ${mailOptions.subject}`,
            html: `${mailOptions.html}<p><small>Original recipient: ${mailOptions.to}</small></p>`,
          },
          true
        );
      }
    }

    throw new Error(`Resend email failed (${response.status}): ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    return { raw: responseText };
  }
};

exports.hasEmailConfig = () => resolveEmailTransport() !== "none";

exports.sendMail = async (mailOptions) => {
  const transport = resolveEmailTransport();

  console.log(`Email transport selected: ${transport}`);

  if (transport === "resend") {
    return sendWithResend(mailOptions);
  }

  if (transport === "smtp") {
    try {
      return await smtpTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error("SMTP delivery failed:", {
        code: error?.code,
        command: error?.command,
        response: error?.response,
        message: error?.message,
      });
      throw error;
    }
  }

  throw new Error("No email transport configured.");
};

exports.resolveEmailTransport = resolveEmailTransport;
