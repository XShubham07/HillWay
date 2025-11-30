import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  const refId = searchParams.get('refId'); // Expecting format like 'HW-A1B2C3' or just 'A1B2C3'

  if (!phone || !refId) {
    return NextResponse.json({ success: false, error: "Phone and Reference ID are required" }, { status: 400 });
  }

  try {
    // 1. Clean the Reference ID input (remove '#', 'HW-', whitespace)
    const cleanRef = refId.replace(/#|HW-/gi, '').trim().toUpperCase();

    // 2. Fetch all bookings for this phone number (Optimization: Indexing phone in DB recommended)
    // We search by phone first because searching by partial _id in Mongo is slower without specific setup.
    // Also, phone + RefID acts as a simple 2-factor verification.
    const userBookings = await Booking.find({ 
      phone: { $regex: phone.trim(), $options: 'i' } // Flexible search for phone
    });

    // 3. Filter in memory to match the last 6 characters of the ObjectId
    const match = userBookings.find(b => 
      b._id.toString().slice(-6).toUpperCase() === cleanRef
    );

    if (!match) {
      return NextResponse.json({ success: false, error: "Booking not found. Please check your details." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: match });

  } catch (error) {
    console.error("Booking Status Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}