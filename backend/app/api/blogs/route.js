import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ObjectId } from 'mongodb';

// Helper to get native MongoDB DB from mongoose
async function getDb() {
  const mongoose = await dbConnect();
  return mongoose.connection.db;
}

export async function GET() {
  try {
    const db = await getDb();
    const blogs = await db.collection('blogs').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, date, author, excerpt, category, coverImage, tags, content } = body;

    if (!title || !content || !excerpt) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const db = await getDb();

    const newBlog = {
      title, slug, date: date || new Date().toISOString().split('T')[0],
      author: author || 'HillWay Team', excerpt, category: category || 'Travel Tips',
      coverImage: coverImage || '', tags: tags || [], content,
      createdAt: new Date(), updatedAt: new Date(),
    };

    const result = await db.collection('blogs').insertOne(newBlog);

    // REMOVED FS.WRITEFILESYNC TO FIX EROFS ERROR

    return NextResponse.json({
      success: true,
      data: { ...newBlog, _id: result.insertedId },
      message: 'Blog published successfully to Database!',
    });
  } catch (error) {
    console.error('POST /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, title, date, author, excerpt, category, coverImage, tags, content, slug } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Missing Blog ID' }, { status: 400 });
    }

    const db = await getDb();
    const updatedBlog = {
      title, slug, date, author, excerpt, category, coverImage, tags, content,
      updatedAt: new Date(),
    };

    await db.collection('blogs').updateOne({ _id: new ObjectId(_id) }, { $set: updatedBlog });

    // REMOVED FS.WRITEFILESYNC TO FIX EROFS ERROR

    return NextResponse.json({ success: true, message: 'Blog updated successfully in Database!' });
  } catch (error) {
    console.error('PUT /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });

    // REMOVED FS.UNLINKSYNC TO FIX EROFS ERROR

    return NextResponse.json({ success: true, message: 'Blog deleted successfully from Database!' });
  } catch (error) {
    console.error('DELETE /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
