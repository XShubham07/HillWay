import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

// GET Single Tour (For Edit Form)
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const tour = await Tour.findById(id);
    if (!tour) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: tour });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// PUT (Update Tour)
export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json({ success: true, data: tour });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE (Remove Tour)
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    await Tour.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}