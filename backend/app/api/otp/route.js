import dbConnect from '@/lib/db';
import Otp from '@/models/Otp';
import Booking from '@/models/Booking'; // Import Booking to check for duplicates
import { sendOtpEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, name, phone, tourTitle } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ success: false, error: "Email and Name required" }, { status: 400 });
    }

    // --- 1. CHECK FOR DUPLICATE BOOKING (Before Sending Code) ---
    // Matches if Phone OR Email exists for the same Tour and isn't Cancelled
    if (phone && tourTitle) {
      const existingBooking = await Booking.findOne({
        $or: [{ phone: phone }, { email: email }],
        tourTitle: tourTitle,
        status: { $ne: 'Cancelled' }
      });

      if (existingBooking) {
        // Return 409 Conflict + the existing booking data
        // This tells the frontend to show the "Booking Found" popup directly
        return NextResponse.json({
          success: false,
          error: "Booking already exists",
          existingBooking
        }, { status: 409 });
      }
    }

    // --- 2. GENERATE & SEND OTP ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert OTP
    await Otp.findOneAndDelete({ email });
    await Otp.create({ email, otp });

    // Send Email
    await sendOtpEmail(email, name, otp);

    return NextResponse.json({ success: true, message: "OTP Sent" });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
  }
}