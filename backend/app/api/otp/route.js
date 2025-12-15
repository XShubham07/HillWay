// backend/app/api/otp/route.js
import dbConnect from '@/lib/db';
import Otp from '@/models/Otp';
import { sendOtpEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ success: false, error: "Email and Name required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert OTP (replace existing if any)
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