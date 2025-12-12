import dbConnect from '@/lib/db';
import Agent from '../../../models/Agent';
import { NextResponse } from 'next/server';

// GET: Fetch All Agents
export async function GET() {
  await dbConnect();
  try {
    const agents = await Agent.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create New Agent
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Check if email exists
    const existing = await Agent.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 });
    }

    const agent = await Agent.create(body);
    return NextResponse.json({ success: true, data: agent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Remove Agent
export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    try {
        await Agent.findByIdAndDelete(id);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}