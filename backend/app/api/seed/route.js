import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    // Pehle purana data saaf karo (Optional: agar duplicate nahi chahiye)
    await Tour.deleteMany({}); 

    // Naya data insert karo
    await Tour.insertMany(body);

    return NextResponse.json({ success: true, message: "Database Seeded Successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}