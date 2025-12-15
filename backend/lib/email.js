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

// ... [Keep all existing email template and booking functions - I'll skip them for brevity]

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
                Have more questions? Reply to this email or contact us at<br/>
                <a href="mailto:enquiry@hillway.in" style="color: #059669; font-weight: 600;">enquiry@hillway.in</a> | <strong>+91-XXXXXXXXXX</strong>
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