import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// --- REUSABLE EMAIL TEMPLATE GENERATOR ---
const getEmailTemplate = ({ title, message, booking, color = '#0891b2', showButton = true }) => {
  const refId = booking._id.toString().slice(-6).toUpperCase();
  const trackUrl = `https://hillway.in/status?refId=${refId}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
        .header { background-color: ${color}; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 30px; color: #374151; }
        .greeting { font-size: 18px; margin-bottom: 20px; color: #111827; }
        .message { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .card { background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #e5e7eb; }
        .card-title { margin-top: 0; color: #111827; font-size: 16px; font-weight: 700; border-bottom: 1px solid #d1d5db; padding-bottom: 10px; margin-bottom: 15px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .label { color: #6b7280; }
        .value { color: #111827; font-weight: 600; text-align: right; }
        .total-row { border-top: 1px dashed #9ca3af; margin-top: 10px; padding-top: 10px; font-weight: 700; font-size: 18px; color: #059669; }
        .btn-container { text-align: center; margin-top: 35px; }
        .btn { background-color: ${color}; color: #ffffff !important; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; background-color: #ffffff; color: ${color}; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        
        <div class="header">
          <h1>${title}</h1>
          <div class="status-badge">#HW-${refId}</div>
        </div>

        <div class="content">
          <p class="greeting">Hi <strong>${booking.name}</strong>,</p>
          <div class="message">${message}</div>

          <div class="card">
            <h3 class="card-title">Booking Details</h3>
            <div style="width: 100%;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Tour Package</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: 600;">${booking.tourTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Travel Date</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: 600;">${new Date(booking.travelDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Contact</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: 600;">${booking.phone}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="card" style="background-color: #ffffff;">
            <h3 class="card-title">Price Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #4b5563;">Adults (${booking.adults})</td>
                <td style="padding: 5px 0; text-align: right;">-</td>
              </tr>
              ${booking.children > 0 ? `
              <tr>
                <td style="padding: 5px 0; color: #4b5563;">Children (${booking.children})</td>
                <td style="padding: 5px 0; text-align: right;">-</td>
              </tr>` : ''}
              <tr>
                <td style="padding-top: 12px; font-weight: 700; color: #111827; border-top: 1px dashed #e5e7eb;">Total Amount</td>
                <td style="padding-top: 12px; font-weight: 700; color: #059669; text-align: right; border-top: 1px dashed #e5e7eb; font-size: 18px;">₹${booking.totalPrice.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          ${showButton ? `
          <div class="btn-container">
            <a href="${trackUrl}" class="btn">Track Booking Status</a>
          </div>
          ` : ''}

          <p style="margin-top: 40px; font-size: 14px; color: #6b7280; text-align: center;">
            Need help?contact <a href="mailto:support@hillway.in" style="color: ${color}">support@hillway.in</a>
          </p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} HillWay Tours. All rights reserved.<br/>
          Patna,Bihar
        </div>
      </div>
    </body>
    </html>
  `;
};

// --- 1. SEND BOOKING RECEIVED EMAIL (INITIAL) ---
export const sendBookingConfirmation = async (booking) => {
  // Check API Key
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing. Emails will not send.");
    return;
  }
  if (!booking.email) return;

  const fromEmail = process.env.EMAIL_FROM || 'HillWay Tours <bookings@hillway.in>';
  const refId = booking._id.toString().slice(-6).toUpperCase();

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: `Booking Received - #HW-${refId}`,
      text: `Hi ${booking.name},\n\nWe have received your booking request for ${booking.tourTitle}.\nBooking ID: #HW-${refId}\nTotal Amount: ₹${booking.totalPrice}\n\nTrack Status: https://hillway.in/status?refId=${refId}`,
      html: getEmailTemplate({
        title: 'Booking Received',
        message: `Thank you for choosing HillWay! We have received your booking request. Our team is currently reviewing availability and will confirm your slot shortly.`,
        booking: booking,
        color: '#0891b2' // Blue for "Received"
      })
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return;
    }
    console.log(`✅ Booking Received email sent to ${booking.email}`);
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
  }
};

// --- 2. SEND STATUS UPDATE (CONFIRMATION, CANCELLATION, ETC) ---
export const sendStatusUpdate = async (booking) => {
  if (!process.env.RESEND_API_KEY || !booking.email) return;

  const fromEmail = process.env.EMAIL_FROM || 'HillWay Tours <bookings@hillway.in>';
  const refId = booking._id.toString().slice(-6).toUpperCase();
  
  // Logic for different statuses
  let title = 'Booking Status Update';
  let message = `The status of your booking has been updated to <strong>${booking.status}</strong>.`;
  let color = '#333';
  let subject = `Update: Booking #HW-${refId}`;

  // CUSTOMIZE BASED ON STATUS
  if (booking.status === 'Confirmed') {
    title = 'Booking Confirmed! 🎉';
    message = `Great news! Your booking for <strong>${booking.tourTitle}</strong> has been officially confirmed. We are excited to host you!`;
    color = '#059669'; // Green for Success
    subject = `Booking Confirmed - #HW-${refId}`;
  } else if (booking.status === 'Cancelled') {
    title = 'Booking Cancelled';
    message = `We're sorry, but your booking for <strong>${booking.tourTitle}</strong> has been cancelled.`;
    color = '#dc2626'; // Red for Cancelled
  } else if (booking.status === 'Completed') {
    title = 'Trip Completed 🏔️';
    message = `We hope you had a wonderful trip to <strong>${booking.tourTitle}</strong>! Thank you for traveling with us.`;
    color = '#7c3aed'; // Purple for Completed
  }

  // Add Admin Note if exists
  if (booking.adminNotes) {
    message += `<br/><br/><strong>Note from Admin:</strong> <br/><em style="background:#fff3cd; padding:5px 10px; border-radius:4px; display:inline-block;">"${booking.adminNotes}"</em>`;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: subject,
      text: `Hi ${booking.name}, ${message.replace(/<[^>]*>?/gm, '')} Track: https://hillway.in/status?refId=${refId}`,
      html: getEmailTemplate({
        title: title,
        message: message,
        booking: booking,
        color: color
      })
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return;
    }
    console.log(`✅ Status Update email sent to ${booking.email}`);
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
  }
};