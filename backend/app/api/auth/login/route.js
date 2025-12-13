import dbConnect from '@/lib/db';
import Agent from '@/models/Agent';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, password, type } = await request.json();

    // 1. ADMIN LOGIN (Hardcoded as requested)
    if (type === 'admin') {
      if (email === 'admin' && password === '1234') {
        
        // --- SECURITY FIX START: Create a response and set the cookie ---
        const adminPayload = { name: 'Super Admin', _id: 'admin', role: 'admin' };
        
        // 1a. Create a simple, random session token (Replace with a proper JWT library later!)
        const token = `admin_session_${Math.random().toString(36).substring(2)}`; 

        // 1b. Create the response object
        const response = NextResponse.json({ 
          success: true, 
          role: 'admin', 
          user: adminPayload 
        });

        // 1c. Set the secure, HttpOnly cookie on the response
        response.cookies.set('admin_session', token, {
          httpOnly: true, // IMPORTANT: Prevents client-side JS access (XSS defense)
          secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/admin', // Only send this cookie to /admin routes for security
        });

        return response;
        // --- SECURITY FIX END ---
      }
      return NextResponse.json({ success: false, error: "Invalid Admin Password" }, { status: 401 });
    } 
    
    // 2. AGENT LOGIN (No cookie needed for agent since their dashboard is on the frontend)
    if (type === 'agent') {
      const agent = await Agent.findOne({ email, password });
      if (!agent) {
        return NextResponse.json({ success: false, error: "Agent not found or wrong password" }, { status: 401 });
      }
      return NextResponse.json({ success: true, role: 'agent', user: agent });
    }

    return NextResponse.json({ success: false, error: "Invalid Login Type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}