import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Coupon from '@/models/Coupon';
import Agent from '@/models/Agent';
import { NextResponse } from 'next/server';

// Email Functions
import { sendBookingConfirmation, sendStatusUpdate } from '@/lib/email';

// ---------------------------------------------------------
// POST: Create Booking
// ---------------------------------------------------------
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();

    // Check for duplicate bookings to prevent spam
    const existingBooking = await Booking.findOne({
      phone: body.phone,
      tourTitle: body.tourTitle,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return NextResponse.json({
        success: false,
        error: "Booking already exists",
        existingBooking
      }, { status: 409 });
    }

    const booking = await Booking.create(body);

    // FIX: Added 'await' to ensure email sends before function closes
    try {
      await sendBookingConfirmation(booking);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue execution - don't fail the booking just because email failed
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
// PUT: Update Status, Payment, Notes, Hotel Details
// ---------------------------------------------------------
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, status, paymentType, paidAmount, adminNotes, hotelDetails } = body;

    if (!id || !status)
      return NextResponse.json({ success: false, error: "ID/Status missing" }, { status: 400 });

    const oldBooking = await Booking.findById(id);
    if (!oldBooking)
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });

    // ---------------------------------------------------------
    // Handle Coupon + Agent Commission
    // ---------------------------------------------------------
    if (status === 'Confirmed' && oldBooking.status !== 'Confirmed') {
      if (oldBooking.couponCode) {
        const coupon = await Coupon.findOneAndUpdate(
          { code: oldBooking.couponCode },
          { $inc: { usedCount: 1 } }
        );

        if (coupon && coupon.agentId) {
          const agent = await Agent.findById(coupon.agentId);

          if (agent) {
            const commission = Math.round(oldBooking.totalPrice * (agent.commissionRate / 100));

            await Agent.findByIdAndUpdate(coupon.agentId, {
              $inc: { totalCommission: commission }
            });

            await Booking.findByIdAndUpdate(id, {
              agentId: coupon.agentId,
              commissionAmount: commission
            });
          }
        }
      }
    }

    // ---------------------------------------------------------
    // Build Update Object
    // ---------------------------------------------------------
    const updateData = { status };

    if (paymentType) updateData.paymentType = paymentType;
    if (paidAmount !== undefined) updateData.paidAmount = Number(paidAmount);
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (hotelDetails) updateData.hotelDetails = hotelDetails;

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    // ---------------------------------------------------------
    // Send Status Update Email when status changes
    // ---------------------------------------------------------
    if (oldBooking.status !== status) {
      // FIX: Added 'await' here too for reliability
      try {
        await sendStatusUpdate(updatedBooking);
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
      }
    }

    return NextResponse.json({ success: true, data: updatedBooking });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}