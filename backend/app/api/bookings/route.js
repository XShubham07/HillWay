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

// PUT: Update Status & Payment Info
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, status, paymentType, paidAmount, adminNotes } = body;
    
    if (!id || !status) return NextResponse.json({ success: false, error: "ID/Status missing" }, { status: 400 });

    const oldBooking = await Booking.findById(id);
    if (!oldBooking) return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });

    // Handle Coupons & Commission on Confirmation
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
             await Agent.findByIdAndUpdate(coupon.agentId, { $inc: { totalCommission: commission } });
             await Booking.findByIdAndUpdate(id, { agentId: coupon.agentId, commissionAmount: commission });
           }
        }
      }
    }

    // Construct Update Object
    const updateData = { status };
    if (paymentType) updateData.paymentType = paymentType;
    if (paidAmount !== undefined) updateData.paidAmount = Number(paidAmount);
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}