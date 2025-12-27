import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // FIXED: Changed to default import
import GlobalPrice from '@/models/GlobalPrice';

export async function GET() {
  await dbConnect(); // FIXED: Calling the default exported function
  
  // Fetch the first (and only) settings document, or create default if missing
  let settings = await GlobalPrice.findOne();
  if (!settings) {
    settings = await GlobalPrice.create({});
  }
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(req) {
  try {
    await dbConnect(); // FIXED: Calling the default exported function
    const body = await req.json();
    
    // Update the singleton document
    const settings = await GlobalPrice.findOneAndUpdate({}, body, { 
      new: true, 
      upsert: true // Create if doesn't exist
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Pricing API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
