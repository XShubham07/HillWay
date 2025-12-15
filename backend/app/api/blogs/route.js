import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('hillway');
    
    const blogs = await db.collection('blogs')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, date, author, excerpt, category, coverImage, tags, content, slug } = body;

    if (!title || !content || !excerpt || !slug) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('hillway');

    // Create blog in MongoDB
    const newBlog = {
      title,
      slug,
      date: date || new Date().toISOString().split('T')[0],
      author: author || 'HillWay Team',
      excerpt,
      category: category || 'Travel Tips',
      coverImage: coverImage || '',
      tags: tags || [],
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('blogs').insertOne(newBlog);

    // Create .md file in blog/content/posts/
    const blogPath = path.join(process.cwd(), '..', 'blog', 'content', 'posts');
    
    // Ensure directory exists
    if (!fs.existsSync(blogPath)) {
      fs.mkdirSync(blogPath, { recursive: true });
    }

    const markdownContent = `---
title: "${title}"
date: "${newBlog.date}"
author: "${newBlog.author}"
excerpt: "${excerpt}"
category: "${category}"
coverImage: "${coverImage}"
tags: ${JSON.stringify(tags || [])}
---

${content}`;

    fs.writeFileSync(path.join(blogPath, `${slug}.md`), markdownContent, 'utf8');

    return NextResponse.json({ 
      success: true, 
      data: { ...newBlog, _id: result.insertedId },
      message: 'Blog published successfully!' 
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

    if (!_id || !title || !content || !excerpt || !slug) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('hillway');

    const updatedBlog = {
      title,
      slug,
      date,
      author,
      excerpt,
      category,
      coverImage,
      tags,
      content,
      updatedAt: new Date()
    };

    await db.collection('blogs').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedBlog }
    );

    // Update .md file
    const blogPath = path.join(process.cwd(), '..', 'blog', 'content', 'posts');
    const markdownContent = `---
title: "${title}"
date: "${date}"
author: "${author}"
excerpt: "${excerpt}"
category: "${category}"
coverImage: "${coverImage}"
tags: ${JSON.stringify(tags || [])}
---

${content}`;

    fs.writeFileSync(path.join(blogPath, `${slug}.md`), markdownContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Blog updated successfully!' });
  } catch (error) {
    console.error('PUT /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id || !slug) {
      return NextResponse.json({ success: false, error: 'Missing id or slug' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('hillway');

    // Delete from MongoDB
    await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });

    // Delete .md file
    const blogPath = path.join(process.cwd(), '..', 'blog', 'content', 'posts', `${slug}.md`);
    if (fs.existsSync(blogPath)) {
      fs.unlinkSync(blogPath);
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully!' });
  } catch (error) {
    console.error('DELETE /api/blogs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
