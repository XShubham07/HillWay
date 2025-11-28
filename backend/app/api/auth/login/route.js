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
        return NextResponse.json({ success: true, role: 'admin', user: { name: 'Super Admin', _id: 'admin' } });
      }
      return NextResponse.json({ success: false, error: "Invalid Admin Password" }, { status: 401 });
    } 
    
    // 2. AGENT LOGIN (Database Check)
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