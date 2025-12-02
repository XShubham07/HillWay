import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  const refId = searchParams.get('refId');

  // Require at least RefID
  if (!refId) {
    return NextResponse.json({ success: false, error: "Reference ID is required" }, { status: 400 });
  }

  try {
    const cleanRef = refId.replace(/#|HW-/gi, '').trim().toUpperCase();
    let match = null;

    if (phone) {
      // 1. If phone is provided, search by phone first (More efficient)
      const userBookings = await Booking.find({
        phone: { $regex: phone.trim(), $options: 'i' }
      });
      match = userBookings.find(b =>
        b._id.toString().slice(-6).toUpperCase() === cleanRef
      );
    } else {
      // 2. If NO phone, search by ID suffix alone.
      // Note: In a production app with millions of records, you should store the 'shortId' 
      // as a separate indexed field. For this scale, scanning is acceptable.
      const allBookings = await Booking.find({});
      match = allBookings.find(b =>
        b._id.toString().slice(-6).toUpperCase() === cleanRef
      );
    }

    if (!match) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: match });

  } catch (error) {
    console.error("Booking Status Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}