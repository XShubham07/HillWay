import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

/**
 * POST /api/bookings/check
 * Check if a booking already exists for the given phone and tour
 * Used before sending OTP to prevent duplicate bookings
 */
export async function POST(request) {
  await dbConnect();
  
  try {
    const { phone, tourTitle } = await request.json();

    if (!phone || !tourTitle) {
      return NextResponse.json(
        { success: false, error: "Phone and tourTitle required" },
        { status: 400 }
      );
    }

    // Check for existing booking with the same phone and tour (excluding cancelled)
    const existingBooking = await Booking.findOne({
      phone: phone,
      tourTitle: tourTitle,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return NextResponse.json({
        exists: true,
        booking: existingBooking,
        message: "A booking already exists for this phone number and tour"
      });
    }

    return NextResponse.json({
      exists: false,
      message: "No existing booking found"
    });

  } catch (error) {
    console.error("Booking check error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check booking" },
      { status: 500 }
    );
  }
}