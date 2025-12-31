import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';

const slugify = (text) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// GET Single Tour (Supports ID or Slug)
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;

    // Check if 'id' looks like a Mongo ID. If yes, search by _id, otherwise search by slug
    let query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const tour = await Tour.findOne(query);
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

    // Only regenerate slug from title if slug is empty/not provided
    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }

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