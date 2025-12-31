import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

// Helper to create URL-friendly slugs
const slugify = (text) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

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

    // Generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }

    // Check if slug already exists (for cloning scenario)
    if (body.slug) {
      const existing = await Tour.findOne({ slug: body.slug });
      if (existing) {
        // Generate unique slug by appending timestamp
        body.slug = `${body.slug}-${Date.now().toString(36)}`;
      }
    }

    const tour = await Tour.create(body);
    return NextResponse.json({ success: true, data: tour }, { status: 201 });
  } catch (error) {
    console.error("❌ POST ERROR:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}