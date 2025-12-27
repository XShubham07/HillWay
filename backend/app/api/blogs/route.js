import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// FIX: Use Mongoose's ObjectId instead of importing from 'mongodb'
// because 'mongodb' is not listed in your package.json dependencies.
const ObjectId = mongoose.Types.ObjectId;

// Helper to get native MongoDB DB from mongoose
async function getDb() {
  const conn = await dbConnect();
  return conn.connection.db;
}

// GET - Fetch all blogs or single blog by slug
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');

    const db = await getDb();
    
    // Get single blog by slug
    if (slug) {
      const blog = await db.collection('blogs').findOne({ slug });
      if (!blog) {
        return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: blog });
    }

    // Build query filter
    let filter = {};
    // Only apply category filter if it's not "all"
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (published === 'true') filter.published = true;

    // Get all blogs with filters
    const blogs = await db.collection('blogs')
      .find(filter)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create new blog
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      title, date, author, excerpt, category, coverImage, 
      tags, content, contentBoxes, featured, published, readingTime 
    } = body;

    if (!title || !excerpt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: title, excerpt' 
      }, { status: 400 });
    }

    // Generate slug from title
    const slug = body.slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const db = await getDb();

    // Check if slug already exists
    const existing = await db.collection('blogs').findOne({ slug });
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'A blog with this slug already exists' 
      }, { status: 400 });
    }

    const newblog = {
      title,
      slug,
      date: date || new Date().toISOString().split('T')[0],
      author: author || 'HillWay Team',
      excerpt,
      category: category || 'Travel Tips',
      coverImage: coverImage || '',
      tags: tags || [],
      content: content || '',
      contentBoxes: contentBoxes || [],
      featured: featured || false,
      published: published !== undefined ? published : true,
      readingTime: readingTime || '',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('blogs').insertOne(newblog);

    return NextResponse.json({
      success: true,
      data: { ...newblog, _id: result.insertedId },
      message: 'Blog post created successfully!',
    });
  } catch (error) {
    console.error('POST /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Update existing blog
export async function PUT(req) {
  try {
    const body = await req.json();
    const { 
      _id, title, date, author, excerpt, category, coverImage, 
      tags, content, contentBoxes, slug, featured, published, readingTime 
    } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Missing blog ID' }, { status: 400 });
    }

    const db = await getDb();

    // If slug changed, check if new slug is available
    if (slug) {
      const existing = await db.collection('blogs').findOne({ 
        slug, 
        _id: { $ne: new ObjectId(_id) } 
      });
      if (existing) {
        return NextResponse.json({ 
          success: false, 
          error: 'A blog with this slug already exists' 
        }, { status: 400 });
      }
    }

    const updatedblog = {
      title,
      slug,
      date,
      author,
      excerpt,
      category,
      coverImage,
      tags: tags || [],
      content: content || '',
      contentBoxes: contentBoxes || [],
      featured: featured || false,
      published: published !== undefined ? published : true,
      readingTime: readingTime || '',
      updatedAt: new Date(),
    };

    await db.collection('blogs').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedblog }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Blog post updated successfully!' 
    });
  } catch (error) {
    console.error('PUT /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Delete blog
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing blog ID' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Blog not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Blog post deleted successfully!' 
    });
  } catch (error) {
    console.error('DELETE /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}