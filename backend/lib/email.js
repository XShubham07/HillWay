import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// --- CONFIGURATION ---
// OTP emails come from noreply@hillway.in
const OTP_SENDER = 'HillWay Tours <noreply@hillway.in>';
// Booking confirmations and updates come from bookings@hillway.in
const BOOKINGS_SENDER = 'HillWay Bookings <bookings@hillway.in>';
// Enquiry emails come from enquiry@hillway.in
const ENQUIRY_SENDER = 'HillWay Enquiries <enquiry@hillway.in>';

// --- REUSABLE EMAIL TEMPLATE GENERATOR ---
const getEmailTemplate = ({ title, message, booking, color = '#0891b2', showButton = true }) => {
  const refId = booking._id.toString().slice(-6).toUpperCase();
  const trackUrl = `https://hillway.in/status?refId=${refId}`;
  
  // --- UPDATED CALCULATION LOGIC ---
  const paidAmount = booking.paidAmount || 0;
  const additionalDiscount = booking.additionalDiscount || 0;
  
  // Net Payable is Total - Manual Discount
  const netPayable = booking.totalPrice - additionalDiscount;
  
  // Due is Net Payable - Paid
  const dueAmount = netPayable - paidAmount;

  // Coupon Logic (Legacy)
  const originalPrice = booking.originalPrice || booking.totalPrice;
  const couponDiscount = originalPrice - booking.totalPrice;

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
          <div class="card" style="background-color: #ffffff;">
            <h3 class="card-title">Payment Summary</h3>
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
              
              ${couponDiscount > 0 ? `
              <tr>
                <td style="padding: 5px 0; color: #16a34a;">Coupon Discount</td>
                <td style="padding: 5px 0; text-align: right; color: #16a34a;">- ₹${couponDiscount.toLocaleString('en-IN')}</td>
              </tr>` : ''}

              <tr>
                <td style="padding-top: 8px; font-weight: 600; color: #374151; border-top: 1px dashed #e5e7eb;">Subtotal</td>
                <td style="padding-top: 8px; font-weight: 600; color: #374151; text-align: right; border-top: 1px dashed #e5e7eb;">₹${booking.totalPrice.toLocaleString('en-IN')}</td>
              </tr>

              ${additionalDiscount > 0 ? `
              <tr style="background-color: #fef2f2;">
                <td style="padding: 5px; color: #dc2626; font-weight: 600;">Less Discount</td>
                <td style="padding: 5px; text-align: right; color: #dc2626; font-weight: 600;">- ₹${additionalDiscount.toLocaleString('en-IN')}</td>
              </tr>` : ''}
              
              <tr>
                <td style="padding: 12px 0; font-weight: 800; color: #111827; font-size: 16px;">Net Payable</td>
                <td style="padding: 12px 0; font-weight: 800; color: #111827; text-align: right; font-size: 16px;">₹${netPayable.toLocaleString('en-IN')}</td>
              </tr>

              ${booking.status === 'Confirmed' || booking.paymentType === 'Partial' || paidAmount > 0 ? `
              <tr>
                <td style="padding: 5px 0; color: #059669; font-weight: 600;">Amount Paid</td>
                <td style="padding: 5px 0; text-align: right; color: #059669; font-weight: 600;">₹${paidAmount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #dc2626; font-weight: 600;">Balance Due</td>
                <td style="padding: 5px 0; text-align: right; color: #dc2626; font-weight: 600;">₹${dueAmount.toLocaleString('en-IN')}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          ${showButton ? `
          <div class="btn-container">
            <a href="${trackUrl}" class="btn">Track Booking Status</a>
          </div>
          ` : ''}
          <p style="margin-top: 40px; font-size: 14px; color: #6b7280; text-align: center;">
            Need help? Contact us at <a href="mailto:contact@hillway.in" style="color: ${color}">contact@hillway.in</a>
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} HillWay Tours. All rights reserved.<br/>
          Bhagwat Nagar, Patna ,Bihar-800026
        </div>
      </div>
    </body>
    </html>
  `;
};

// --- 1. SEND OTP EMAIL ---
export const sendOtpEmail = async (email, name, otp) => {
  if (!process.env.RESEND_API_KEY) return;
  
  try {
    await resend.emails.send({
      from: OTP_SENDER,
      to: email,
      subject: `${otp} is your verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 40px auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #0891b2; margin-top: 0; text-align: center;">Verify your Email</h2>
          <p style="color: #374151; font-size: 16px;">Hi ${name},</p>
          <p style="color: #4b5563; line-height: 1.5;">Please use the code below to complete your booking with HillWay Tours. This code is valid for 5 minutes.</p>
          
          <div style="background: #f0f9ff; padding: 24px; text-align: center; border-radius: 12px; border: 1px dashed #0891b2; margin: 25px 0;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0e7490; font-family: monospace;">${otp}</span>
          </div>
          
          <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              <strong>This is an automated message. Please do not reply to this email.</strong><br/>
              For assistance, contact us at <a href="mailto:contact@hillway.in" style="color: #0891b2;">contact@hillway.in</a>
            </p>
          </div>
        </div>
      `
    });
    console.log(`✅ OTP sent to ${email}`);
  } catch (err) {
    console.error("❌ OTP Email Failed:", err);
    throw new Error("Failed to send verification email");
  }
};

// --- 2. SEND BOOKING RECEIVED EMAIL ---
export const sendBookingConfirmation = async (booking) => {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing.");
    return;
  }
  if (!booking.email) return;

  const refId = booking._id.toString().slice(-6).toUpperCase();

  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_SENDER,
      to: booking.email,
      subject: `Booking Received - #HW-${refId}`,
      text: `Hi ${booking.name},\n\nWe have received your booking request for ${booking.tourTitle}.\nBooking ID: #HW-${refId}\nTotal Amount: ₹${booking.totalPrice}\n\nTrack Status: https://hillway.in/status?refId=${refId}`,
      html: getEmailTemplate({
        title: 'Booking Received',
        message: `Thank you for choosing HillWay! We have received your booking request. Our team is currently reviewing availability and will confirm your slot shortly.`,
        booking: booking,
        color: '#0891b2'
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

// --- 3. SEND STATUS UPDATE ---
export const sendStatusUpdate = async (booking) => {
  if (!process.env.RESEND_API_KEY || !booking.email) return;

  const refId = booking._id.toString().slice(-6).toUpperCase();
  
  let title = 'Booking Status Update';
  let message = `The status of your booking has been updated to <strong>${booking.status}</strong>.`;
  let color = '#333';
  let subject = `Update: Booking #HW-${refId}`;

  if (booking.status === 'Confirmed') {
    title = 'Booking Confirmed! 🎉';
    message = `Great news! Your booking for <strong>${booking.tourTitle}</strong> has been officially confirmed.`;
    color = '#059669'; // Green
    subject = `Booking Confirmed - #HW-${refId}`;
  } else if (booking.status === 'Cancelled') {
    title = 'Booking Cancelled';
    message = `We're sorry, but your booking for <strong>${booking.tourTitle}</strong> has been cancelled.`;
    color = '#dc2626'; // Red
  }

  if (booking.adminNotes) {
    message += `<br/><br/><strong>Note from Admin:</strong> <br/><em style="background:#fff3cd; padding:5px 10px; border-radius:4px; display:inline-block;">${booking.adminNotes}</em>`;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_SENDER,
      to: booking.email,
      subject: subject,
      text: `Hi ${booking.name}, status updated to ${booking.status}. Track: https://hillway.in/status?refId=${refId}`,
      html: getEmailTemplate({
        title: title,
        message: message,
        booking: booking,
        color: color
      })
    });

    if (error) console.error("❌ Resend Error:", error);
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
  }
};

// --- 4. SEND ADMIN ALERT ---
export const sendAdminNewBookingAlert = async (booking) => {
  if (!process.env.RESEND_API_KEY) return;

  const adminEmail = 'admin@hillway.in'; 

  try {
    await resend.emails.send({
      from: BOOKINGS_SENDER,
      to: adminEmail,
      subject: `🔔 New Booking: ${booking.name} (${booking.tourTitle})`,
      text: `New Booking Received!\n\nAbhay: ${booking.name}\nPhone: ${booking.phone}\nPackage: ${booking.tourTitle}\nTotal: ₹${booking.totalPrice}\n\nLogin to Admin Panel to confirm.`,
      html: getEmailTemplate({
        title: 'New Booking Alert!',
        message: `You have received a new booking request from <strong>${booking.name}</strong>.`,
        booking,
        color: '#d97706',
        isAdmin: true
      })
    });
    console.log(`✅ Admin Alert sent to ${adminEmail}`);
  } catch (err) {
    console.error("❌ Admin Email Failed:", err);
  }
};

// --- 5. SEND ENQUIRY CONFIRMATION TO USER ---
export const sendEnquiryConfirmation = async (enquiry) => {
  if (!process.env.RESEND_API_KEY) return;
  if (!enquiry.email) return;

  const enquiryId = enquiry._id.toString().slice(-6).toUpperCase();

  try {
    await resend.emails.send({
      from: ENQUIRY_SENDER,
      to: enquiry.email,
      subject: 'We\'ve Received Your Enquiry - HillWay Tours',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
            .header { background-color: #7c3aed; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; background-color: #ffffff; color: #7c3aed; margin-top: 8px; }
            .content { padding: 30px; color: #374151; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #111827; }
            .message { font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #4b5563; }
            .card { background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb; }
            .card-title { margin-top: 0; color: #111827; font-size: 16px; font-weight: 700; border-bottom: 1px solid #d1d5db; padding-bottom: 10px; margin-bottom: 15px; }
            .detail-row { margin-bottom: 12px; }
            .label { color: #6b7280; font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px; }
            .value { color: #111827; font-size: 15px; font-weight: 600; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
            .highlight { background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Thank You for Reaching Out!</h1>
              <div class="badge">#ENQ-${enquiryId}</div>
            </div>
            <div class="content">
              <p class="greeting">Hi <strong>${enquiry.name}</strong>,</p>
              <p class="message">
                We've successfully received your enquiry! Our travel experts are reviewing your requirements and will get back to you within 24 hours with personalized recommendations and pricing.
              </p>
              
              <div class="highlight">
                <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 14px;">
                  ✨ <strong>What happens next?</strong><br/>
                  Our team will analyze your preferences and create a customized travel plan just for you. We'll reach out via email or phone to discuss the details.
                </p>
              </div>

              <div class="card">
                <h3 class="card-title">Your Enquiry Details</h3>
                <div class="detail-row">
                  <span class="label">Preferred Destination</span>
                  <span class="value">${enquiry.destination}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Trip Duration</span>
                  <span class="value">${enquiry.duration}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Contact Number</span>
                  <span class="value">${enquiry.contact}</span>
                </div>
                ${enquiry.notes ? `
                <div class="detail-row">
                  <span class="label">Additional Notes</span>
                  <span class="value" style="font-weight: 400; font-style: italic;">${enquiry.notes}</span>
                </div>
                ` : ''}
              </div>

              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                Need immediate assistance? <br/>
                Contact us at <a href="mailto:contact@hillway.in" style="color: #7c3aed; font-weight: 600;">contact@hillway.in</a> or call <strong>+91-XXXXXXXXXX</strong>
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} HillWay Tours. All rights reserved.<br/>
              Sikkim, India
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Enquiry confirmation sent to ${enquiry.email}`);
  } catch (err) {
    console.error("❌ Enquiry Confirmation Email Failed:", err);
  }
};

// --- 6. SEND ADMIN ENQUIRY ALERT ---
export const sendAdminEnquiryAlert = async (enquiry) => {
  if (!process.env.RESEND_API_KEY) return;

  const adminEmail = 'admin@hillway.in';
  const enquiryId = enquiry._id.toString().slice(-6).toUpperCase();

  try {
    await resend.emails.send({
      from: ENQUIRY_SENDER,
      to: adminEmail,
      subject: `📩 New Enquiry: ${enquiry.name} - ${enquiry.destination}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
            .header { background-color: #dc2626; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; background-color: #ffffff; color: #dc2626; margin-top: 8px; }
            .content { padding: 30px; color: #374151; }
            .card { background-color: #fef2f2; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 2px solid #fca5a5; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #fee2e2; }
            .label { color: #991b1b; font-weight: 600; font-size: 14px; }
            .value { color: #111827; font-weight: 600; font-size: 14px; text-align: right; }
            .btn { background-color: #dc2626; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 20px; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Enquiry Received</h1>
              <div class="badge">#ENQ-${enquiryId}</div>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #4b5563; margin-bottom: 25px;">
                A new customer has submitted an enquiry through the contact page. Please review and respond promptly.
              </p>
              
              <div class="card">
                <div class="detail-row">
                  <span class="label">Customer Name</span>
                  <span class="value">${enquiry.name}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email</span>
                  <span class="value">${enquiry.email}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Contact</span>
                  <span class="value">${enquiry.contact}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Destination</span>
                  <span class="value">${enquiry.destination}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Duration</span>
                  <span class="value">${enquiry.duration}</span>
                </div>
                ${enquiry.notes ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #fca5a5;">
                  <span class="label" style="display: block; margin-bottom: 8px;">Additional Notes:</span>
                  <p style="margin: 0; color: #111827; font-style: italic; background: #fff; padding: 10px; border-radius: 6px;">${enquiry.notes}</p>
                </div>
                ` : ''}
              </div>

              <div style="text-align: center;">
                <a href="https://admin.hillway.in/admin" class="btn">View in Admin Panel</a>
              </div>
            </div>
            <div class="footer">
              Enquiry submitted on ${new Date(enquiry.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Admin enquiry alert sent to ${adminEmail}`);
  } catch (err) {
    console.error("❌ Admin Enquiry Alert Failed:", err);
  }
};

// --- 7. SEND CUSTOM ENQUIRY RESPONSE ---
export const sendEnquiryResponse = async (enquiry, customMessage) => {
  if (!process.env.RESEND_API_KEY) return;
  if (!enquiry.email) return;

  const enquiryId = enquiry._id.toString().slice(-6).toUpperCase();

  try {
    await resend.emails.send({
      from: ENQUIRY_SENDER,
      to: enquiry.email,
      subject: `Response to Your Enquiry - HillWay Tours`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
            .header { background-color: #059669; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; background-color: #ffffff; color: #059669; margin-top: 8px; }
            .content { padding: 30px; color: #374151; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #111827; }
            .message-box { background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .message-box p { margin: 0; line-height: 1.6; color: #064e3b; white-space: pre-line; }
            .card { background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb; }
            .card-title { margin-top: 0; color: #111827; font-size: 14px; font-weight: 700; margin-bottom: 10px; }
            .detail-row { margin-bottom: 8px; font-size: 13px; }
            .label { color: #6b7280; }
            .value { color: #111827; font-weight: 600; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Response from HillWay Tours</h1>
              <div class="badge">RE: #ENQ-${enquiryId}</div>
            </div>
            <div class="content">
              <p class="greeting">Hi <strong>${enquiry.name}</strong>,</p>
              
              <div class="message-box">
                <p>${customMessage}</p>
              </div>

              <div class="card">
                <div class="card-title">Your Original Enquiry</div>
                <div class="detail-row">
                  <span class="label">Destination:</span> <span class="value">${enquiry.destination}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Duration:</span> <span class="value">${enquiry.duration}</span>
                </div>
              </div>

              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                Have more questions?contact us at<br/>
                <a href="mailto:contact@hillway.in" style="color: #059669; font-weight: 600;">contact@hillway.in</a> | <strong>+91-XXXXXXXXXX</strong>
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} HillWay Tours. All rights reserved.<br/>
              Sikkim, India
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Custom enquiry response sent to ${enquiry.email}`);
  } catch (err) {
    console.error("❌ Enquiry Response Email Failed:", err);
    throw new Error("Failed to send enquiry response");
  }
};