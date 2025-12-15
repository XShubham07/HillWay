import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const location = searchParams.get('location');

  try {
    const query = {};
    
    // Filter by Tag
    if (tag && tag !== 'All') {
      query.tags = { $in: [tag] }; 
    }

    // Filter by Location
    if (location && location !== 'All') {
      // Create a case-insensitive regex for location matching
      query.location = { $regex: new RegExp(`^${location}$`, 'i') };
    }

    const tours = await Tour.find(query);
    return NextResponse.json({ success: true, data: tours });
  } catch (error) {
    console.error("❌ API ERROR:", error.message); 
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const tour = await Tour.create(body);
    return NextResponse.json({ success: true, data: tour }, { status: 201 });
  } catch (error) {
    console.error("❌ POST ERROR:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}