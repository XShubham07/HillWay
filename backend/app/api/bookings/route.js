import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Coupon from '@/models/Coupon';
import Agent from '@/models/Agent';
import Otp from '@/models/Otp'; 
import { NextResponse } from 'next/server';

// Email Functions
import { sendBookingConfirmation, sendStatusUpdate, sendAdminNewBookingAlert } from '@/lib/email';

// ---------------------------------------------------------
// POST: Create Booking (With OTP Verification)
// ---------------------------------------------------------
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { otp, email, ...bookingData } = body; 

    // --- 1. VERIFY OTP ---
    if (!otp) {
      return NextResponse.json({ success: false, error: "Verification code required" }, { status: 400 });
    }

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return NextResponse.json({ success: false, error: "Invalid or expired verification code" }, { status: 400 });
    }

    // --- 2. DELETE OTP (PREVENT REUSE) ---
    await Otp.deleteOne({ _id: validOtp._id });

    // --- 3. DUPLICATE CHECK ---
    const existingBooking = await Booking.findOne({
      phone: bookingData.phone,
      tourTitle: bookingData.tourTitle,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return NextResponse.json({
        success: false,
        error: "Booking already exists",
        existingBooking
      }, { status: 409 });
    }

    // --- 4. CREATE BOOKING ---
    const booking = await Booking.create({ ...bookingData, email });

    // Send Emails in background
    try {
      await Promise.all([
        sendBookingConfirmation(booking),
        sendAdminNewBookingAlert(booking)
      ]);
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// ---------------------------------------------------------
// GET: Fetch All Bookings
// ---------------------------------------------------------
export async function GET() {
  await dbConnect();
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ---------------------------------------------------------
// DELETE: Delete Booking
// ---------------------------------------------------------
export async function DELETE(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id)
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    await Booking.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ---------------------------------------------------------
// ... (Keep imports and other methods POST/GET/DELETE as they are)

// ---------------------------------------------------------
// PUT: Update Status, Payment, Notes, Hotel Details
// ---------------------------------------------------------
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { 
      id, 
      status, 
      adminNotes, 
      hotelDetails, 
      resendEmail, // CHECKBOX VALUE
      additionalDiscount,
      newPayment, 
      updatedPaymentHistory
    } = body;

    if (!id)
      return NextResponse.json({ success: false, error: "ID missing" }, { status: 400 });

    // 1. Fetch Existing Booking
    const booking = await Booking.findById(id);
    if (!booking)
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });

    // 2. Handle Agent Commission (Only if status changing to Confirmed first time)
    if (status === 'Confirmed' && booking.status !== 'Confirmed') {
      if (booking.couponCode) {
        const coupon = await Coupon.findOneAndUpdate(
          { code: booking.couponCode },
          { $inc: { usedCount: 1 } }
        );

        if (coupon && coupon.agentId) {
          const agent = await Agent.findById(coupon.agentId);
          if (agent) {
            const commission = Math.round(booking.totalPrice * (agent.commissionRate / 100));
            await Agent.findByIdAndUpdate(coupon.agentId, {
              $inc: { totalCommission: commission }
            });
            booking.agentId = coupon.agentId;
            booking.commissionAmount = commission;
          }
        }
      }
    }

    // 3. Update Fields
    if (status) booking.status = status;
    // Always update admin notes in database, but we screen them from email later
    if (adminNotes !== undefined) booking.adminNotes = adminNotes; 
    if (hotelDetails) booking.hotelDetails = hotelDetails;
    if (additionalDiscount !== undefined) booking.additionalDiscount = Number(additionalDiscount);

    // 4. Handle Payment History (Edit/Delete or New)
    if (updatedPaymentHistory && Array.isArray(updatedPaymentHistory)) {
      booking.paymentHistory = updatedPaymentHistory;
    }

    if (newPayment && newPayment.amount > 0) {
      booking.paymentHistory.push({
        amount: Number(newPayment.amount),
        note: newPayment.note || "Admin Entry",
        date: new Date()
      });
    }

    // 5. Recalculate Totals
    const totalPaid = booking.paymentHistory.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    booking.paidAmount = totalPaid;

    const discountVal = booking.additionalDiscount || 0;
    const netPrice = booking.totalPrice - discountVal;

    if (totalPaid >= netPrice && netPrice > 0) {
      booking.paymentType = 'Full';
    } else {
      booking.paymentType = 'Partial';
    }

    // 6. Save Changes
    const updatedBooking = await booking.save();

    // 7. HANDLE EMAILS (Strict Logic)
    // Only send if the checkbox "resendEmail" is TRUE.
    if (resendEmail) {
      try {
        // Create a plain object copy to modify safely
        const bookingForEmail = updatedBooking.toObject();
        
        // REMOVE Admin Notes so they don't go to customer
        delete bookingForEmail.adminNotes; 

        await sendStatusUpdate(bookingForEmail);
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
      }
    }

    return NextResponse.json({ success: true, data: updatedBooking });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}