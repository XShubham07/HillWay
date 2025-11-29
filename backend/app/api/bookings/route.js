import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Coupon from '@/models/Coupon';
import Agent from '@/models/Agent';
import { NextResponse } from 'next/server';

// POST: Create Booking
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Check for existing active booking for this phone number & tour
    // We check if status is NOT 'Cancelled' to find active bookings
    const existingBooking = await Booking.findOne({ 
      phone: body.phone, 
      tourTitle: body.tourTitle,
      status: { $ne: 'Cancelled' } 
    });

    if (existingBooking) {
      return NextResponse.json({ 
        success: false, 
        error: "Booking already exists", 
        existingBooking: existingBooking 
      }, { status: 409 });
    }

    const booking = await Booking.create(body);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// GET: Fetch All
export async function GET() {
  await dbConnect();
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE
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

// PUT: Update Status & Increment Coupon/Commission
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) return NextResponse.json({ success: false, error: "ID/Status missing" }, { status: 400 });

    const oldBooking = await Booking.findById(id);
    if (!oldBooking) return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });

    // LOGIC: Increment coupon/commission ONLY if status changes to 'Confirmed'
    if (status === 'Confirmed' && oldBooking.status !== 'Confirmed') {
      
      // 1. Increment Coupon
      if (oldBooking.couponCode) {
        const coupon = await Coupon.findOneAndUpdate(
          { code: oldBooking.couponCode },
          { $inc: { usedCount: 1 } }
        );

        // 2. Add Agent Commission
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

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}