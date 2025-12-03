import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendBookingConfirmation = async (booking) => {
  if (!booking.email) return;

  const mailOptions = {
    from: `"HillWay Tours" <${process.env.GMAIL_USER}>`,
    to: booking.email,
    subject: `Booking Confirmed - #${booking._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #0891b2;">Booking Received!</h2>
        <p>Hi <strong>${booking.name}</strong>,</p>
        <p>Thank you for booking with HillWay. We have received your request for <strong>${booking.tourTitle}</strong>.</p>
        
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> #HW-${booking._id.toString().slice(-6).toUpperCase()}</p>
          <p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${booking.adults} Adults, ${booking.children} Children</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalPrice.toLocaleString()}</p>
          <p><strong>Current Status:</strong> ${booking.status}</p>
        </div>

        <p>You can track your booking status here: <a href="https://hillway7.vercel.app/status?refId=${booking._id.toString().slice(-6).toUpperCase()}">Track Booking</a></p>
        
        <p>Best Regards,<br/>HillWay Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Confirmation email sent to", booking.email);
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};

export const sendStatusUpdate = async (booking) => {
  if (!booking.email) return;

  const statusColors = {
    'Confirmed': '#059669', // Green
    'Cancelled': '#dc2626', // Red
    'Pending': '#d97706'    // Amber
  };

  const color = statusColors[booking.status] || '#333';

  const mailOptions = {
    from: `"HillWay Tours" <${process.env.GMAIL_USER}>`,
    to: booking.email,
    subject: `Update: Your Booking Status is ${booking.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Booking Status Update</h2>
        <p>Hi <strong>${booking.name}</strong>,</p>
        <p>The status of your booking <strong>#HW-${booking._id.toString().slice(-6).toUpperCase()}</strong> has been updated.</p>
        
        <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3>New Status: <span style="color: ${color};">${booking.status}</span></h3>
          ${booking.adminNotes ? `<p><strong>Note form Admin:</strong> "${booking.adminNotes}"</p>` : ''}
        </div>

        ${booking.status === 'Confirmed' ? `<p>Please be ready for your trip on <strong>${new Date(booking.travelDate).toLocaleDateString()}</strong>!</p>` : ''}
        
        <p>View Details: <a href="https://hillway7.vercel.app/status?refId=${booking._id.toString().slice(-6).toUpperCase()}">Track Booking</a></p>
        
        <p>Best Regards,<br/>HillWay Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Status update email sent to", booking.email);
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};