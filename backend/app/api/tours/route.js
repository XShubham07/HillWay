import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const tours = await Tour.find({});
    // Agar tours mil gaye, toh success
    return NextResponse.json({ success: true, data: tours });
  } catch (error) {
    // 👇 (ERROR LOG)
    console.error("❌ API ERROR:", error.message); 
    console.error(error); // Pura error detail

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