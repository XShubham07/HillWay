import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingConfirmation = async (booking) => {
  if (!booking.email) return;

  // You must verify 'hillway.in' on Resend to use 'bookings@hillway.in'
  // If not verified yet, use 'onboarding@resend.dev'
  const fromEmail = process.env.EMAIL_FROM || 'HillWay Tours <bookings@hillway.in>';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
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

          <p>You can track your booking status here: <a href="https://hillway.in/status?refId=${booking._id.toString().slice(-6).toUpperCase()}">Track Booking</a></p>
          
          <p>Best Regards,<br/>HillWay Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return;
    }

    console.log("📧 Confirmation email sent:", data);
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
  }
};

export const sendStatusUpdate = async (booking) => {
  if (!booking.email) return;

  const fromEmail = process.env.EMAIL_FROM || 'HillWay Tours <bookings@hillway.in>';
  
  const statusColors = {
    'Confirmed': '#059669', // Green
    'Cancelled': '#dc2626', // Red
    'Pending': '#d97706'    // Amber
  };

  const color = statusColors[booking.status] || '#333';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: `Update: Your Booking Status is ${booking.status}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Booking Status Update</h2>
          <p>Hi <strong>${booking.name}</strong>,</p>
          <p>The status of your booking <strong>#HW-${booking._id.toString().slice(-6).toUpperCase()}</strong> has been updated.</p>
          
          <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3>New Status: <span style="color: ${color};">${booking.status}</span></h3>
            ${booking.adminNotes ? `<p><strong>Note from Admin:</strong> "${booking.adminNotes}"</p>` : ''}
          </div>

          ${booking.status === 'Confirmed' ? `<p>Please be ready for your trip on <strong>${new Date(booking.travelDate).toLocaleDateString()}</strong>!</p>` : ''}
          
          <p>View Details: <a href="https://hillway.in/status?refId=${booking._id.toString().slice(-6).toUpperCase()}">Track Booking</a></p>
          
          <p>Best Regards,<br/>HillWay Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return;
    }

    console.log("📧 Status update email sent:", data);
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
  }
};