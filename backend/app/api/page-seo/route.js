import dbConnect from '@/lib/db';
import PageSeo from '@/models/PageSeo';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  try {
    if (page) {
      const data = await PageSeo.findOne({ page });
      return NextResponse.json({ success: true, data });
    }
    const all = await PageSeo.find({});
    return NextResponse.json({ success: true, data: all });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { page, title, description, keywords } = body;

    if (!page) {
      return NextResponse.json({ success: false, error: "Page identifier is required" }, { status: 400 });
    }

    const updated = await PageSeo.findOneAndUpdate(
      { page },
      { title, description, keywords },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}