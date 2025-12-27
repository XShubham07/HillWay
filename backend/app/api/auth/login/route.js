import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Agent from '@/models/Agent';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, password, type } = await request.json();

    // 1. ADMIN LOGIN
    if (type === 'admin') {
      const allowedAdmins = ['Prakashabhay5@gmail.com', 'admin@hillway.in'];

      // Basic check for allowed emails
      if (!allowedAdmins.includes(email)) {
        return NextResponse.json({ success: false, error: "Unauthorized email for Admin Access" }, { status: 401 });
      }

      const user = await User.findOne({ email });
      if (!user) {
        // Security: Generic message or specific? 
        // Since we have an allowed list, saying "User not found" is actually helpful for the legitimate admin to know they need to set up/reset password.
        return NextResponse.json({ success: false, error: "Admin account not set up. Please use 'Forgot Password' to set your initial password." }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: "Invalid Password" }, { status: 401 });
      }

      // Success - Set Cookie
      const adminPayload = { email: user.email, role: 'admin', _id: user._id };
      const token = `admin_session_${Math.random().toString(36).substring(2)}`; // Placeholder for JWT

      const response = NextResponse.json({
        success: true,
        role: 'admin',
        user: adminPayload
      });

      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/admin',
      });

      return response;
    }

    // 2. AGENT LOGIN (Unchanged)
    if (type === 'agent') {
      const agent = await Agent.findOne({ email, password });
      if (!agent) {
        return NextResponse.json({ success: false, error: "Agent not found or wrong password" }, { status: 401 });
      }
      return NextResponse.json({ success: true, role: 'agent', user: agent });
    }

    return NextResponse.json({ success: false, error: "Invalid Login Type" }, { status: 400 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}