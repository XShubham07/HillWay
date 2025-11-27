import dbConnect from '@/lib/db';
import GlobalPrice from '@/models/GlobalPrice';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    // Fetch existing or create default
    let pricing = await GlobalPrice.findOne();
    if (!pricing) {
      pricing = await GlobalPrice.create({});
    }
    return NextResponse.json({ success: true, data: pricing });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Update the first document found (since we only have one global price list)
    const pricing = await GlobalPrice.findOneAndUpdate({}, body, {
      new: true,
      upsert: true // Create if doesn't exist
    });
    return NextResponse.json({ success: true, data: pricing });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}