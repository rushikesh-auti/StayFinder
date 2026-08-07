const test = require('node:test');
const assert = require('node:assert/strict');

const { buildBookingEmailHtml } = require('../utils/sendEmail');
const { resolveEmailTransport } = require('../utils/emailService');

test('uses Resend transport when fallback recipient is configured', () => {
  const env = {
    RESEND_API_KEY: 're_test',
    EMAIL_FROM: 'StayFinder <onboarding@resend.dev>',
    EMAIL_FALLBACK_RECIPIENT: 'owner@example.com',
  };

  assert.equal(resolveEmailTransport(env), 'resend');
});

test('buildBookingEmailHtml includes booking summary for both guest and host emails', () => {
  const guestHtml = buildBookingEmailHtml({
    role: 'guest',
    bookingDetails: {
      name: 'Ava',
      property: 'Coastal Villa',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      guests: 2,
      total: 2400,
      bookingId: 'booking_123',
    },
  });

  const hostHtml = buildBookingEmailHtml({
    role: 'host',
    bookingDetails: {
      name: 'Ava',
      property: 'Coastal Villa',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      guests: 2,
      total: 2400,
      bookingId: 'booking_123',
    },
  });

  assert.match(guestHtml, /Booking Confirmed/i);
  assert.match(guestHtml, /Coastal Villa/i);
  assert.match(hostHtml, /New Booking Received/i);
  assert.match(hostHtml, /booking_123/i);
});
