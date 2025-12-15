import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Coupon from '@/models/Coupon';
import Agent from '@/models/Agent';
import Otp from '@/models/Otp'; 
import { NextResponse } from 'next/server';
import { sendBookingConfirmation, sendStatusUpdate, sendAdminNewBookingAlert } from '@/lib/email';

// POST: Create Booking (With OTP Verification)
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { otp, email, ...bookingData } = body; 

    // --- 1. VERIFY OTP ---
    if (!otp) return NextResponse.json({ success: false, error: "Verification code required" }, { status: 400 });

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return NextResponse.json({ success: false, error: "Invalid or expired verification code" }, { status: 400 });

    await Otp.deleteOne({ _id: validOtp._id });

    // --- 2. DUPLICATE CHECK (Safety Net) ---
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

    // --- 3. CREATE BOOKING ---
    const booking = await Booking.create({ ...bookingData, email });

    try {
      await Promise.all([
        sendBookingConfirmation(booking),
        sendAdminNewBookingAlert(booking)
      ]);
    } catch (emailError) { console.error("Failed to send emails:", emailError); }

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, status, paymentType, paidAmount, adminNotes, hotelDetails } = body;

    if (!id || !status) return NextResponse.json({ success: false, error: "ID/Status missing" }, { status: 400 });

    const oldBooking = await Booking.findById(id);
    if (!oldBooking) return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });

    if (status === 'Confirmed' && oldBooking.status !== 'Confirmed') {
      if (oldBooking.couponCode) {
        const coupon = await Coupon.findOneAndUpdate({ code: oldBooking.couponCode }, { $inc: { usedCount: 1 } });
        if (coupon && coupon.agentId) {
          const agent = await Agent.findById(coupon.agentId);
          if (agent) {
            const commission = Math.round(oldBooking.totalPrice * (agent.commissionRate / 100));
            await Agent.findByIdAndUpdate(coupon.agentId, { $inc: { totalCommission: commission } });
            await Booking.findByIdAndUpdate(id, { agentId: coupon.agentId, commissionAmount: commission });
          }
        }
      }
    }

    const updateData = { status };
    if (paymentType) updateData.paymentType = paymentType;
    if (paidAmount !== undefined) updateData.paidAmount = Number(paidAmount);
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (hotelDetails) updateData.hotelDetails = hotelDetails;

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    if (oldBooking.status !== status) {
      try { await sendStatusUpdate(updatedBooking); } catch (e) { console.error(e); }
    }

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}