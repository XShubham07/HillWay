# Blog API Documentation

This document outlines the backend API endpoints needed to support the blog management system in HillWay.

## Base URL
```
Production: https://admin.hillway.in/api
Development: http://localhost:3000/api
```

## Authentication
All admin endpoints require JWT authentication:
```
Authorization: Bearer <token>
```

---

## Public Endpoints

### 1. Get All Published Blog Posts
```http
GET /blog/posts
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `featured` (optional) - Filter featured posts (true/false)
- `limit` (optional) - Number of posts to return
- `page` (optional) - Page number for pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "post_id",
      "title": "Post Title",
      "slug": "post-url-slug",
      "excerpt": "Brief description",
      "content": "Full markdown content",
      "coverImage": "https://...",
      "category": "adventure",
      "featured": false,
      "published": true,
      "date": "2024-12-16T00:00:00.000Z",
      "readingTime": "5 min read",
      "author": {
        "name": "Author Name",
        "role": "Travel Expert",
        "avatar": "https://..."
      },
      "createdAt": "2024-12-16T00:00:00.000Z",
      "updatedAt": "2024-12-16T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Single Blog Post by Slug
```http
GET /blog/posts/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "Post Title",
    "slug": "post-url-slug",
    // ... all post fields
  }
}
```

---

## Admin Endpoints (Require Authentication)

### 3. Get All Posts (Including Drafts)
```http
GET /admin/blog/posts
Authorization: Bearer <token>
```

**Query Parameters:**
- `published` (optional) - Filter by publish status (true/false)
- `category` (optional) - Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "post_id",
      "title": "Post Title",
      "published": false,
      // ... all post fields
    }
  ]
}
```

### 4. Create New Blog Post
```http
POST /admin/blog/posts
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Post Title",
  "slug": "post-url-slug",
  "excerpt": "Brief description",
  "content": "Full markdown content",
  "coverImage": "https://...",
  "category": "adventure",
  "featured": false,
  "published": true,
  "readingTime": "5 min read",
  "author": {
    "name": "Author Name",
    "role": "Travel Expert",
    "avatar": "https://..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "new_post_id",
    // ... created post data
  }
}
```

### 5. Update Blog Post
```http
PUT /admin/blog/posts/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (Same as create, all fields optional)

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "post_id",
    // ... updated post data
  }
}
```

### 6. Delete Blog Post
```http
DELETE /admin/blog/posts/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### 7. Upload Blog Image
```http
POST /admin/blog/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `image` - Image file (max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://your-cdn.com/images/blog/image.jpg",
    "filename": "image.jpg",
    "size": 245678
  }
}
```

---

## MongoDB Schema

### BlogPost Model
```javascript
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    maxLength: 300
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['adventure', 'trekking', 'culture', 'tips', 'guides'],
    default: 'adventure'
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  readingTime: {
    type: String,
    default: ''
  },
  author: {
    name: {
      type: String,
      default: 'HillWay Team'
    },
    role: {
      type: String,
      default: 'Travel Expert'
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better search performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1, published: 1 });
blogPostSchema.index({ featured: 1, published: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
```

---

## Backend Implementation Example (Next.js)

### File Structure
```
backend/
├── app/
│   └── api/
│       ├── blog/
│       │   └── posts/
│       │       ├── route.ts          // GET /api/blog/posts
│       │       └── [slug]/
│       │           └── route.ts      // GET /api/blog/posts/:slug
│       └── admin/
│           └── blog/
│               ├── posts/
│               │   ├── route.ts      // GET, POST /api/admin/blog/posts
│               │   └── [id]/
│               │       └── route.ts  // PUT, DELETE /api/admin/blog/posts/:id
│               └── upload/
│                   └── route.ts      // POST /api/admin/blog/upload
├── models/
│   └── BlogPost.ts
└── lib/
    └── cloudinary.ts                 // Image upload service
```

### Example Route: GET /api/blog/posts
```typescript
// app/api/blog/posts/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import BlogPost from '@/models/BlogPost';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query: any = { published: true };
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const posts = await BlogPost.find(query)
      .sort({ date: -1 })
      .select('-__v');

    return NextResponse.json({
      success: true,
      data: posts
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

### Example Route: POST /api/admin/blog/posts
```typescript
// app/api/admin/blog/posts/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    const user = await verifyToken(token);
    
    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Check if slug already exists
    const existing = await BlogPost.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists' },
        { status: 400 }
      );
    }

    const post = await BlogPost.create({
      ...body,
      createdBy: user._id
    });

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

---

## Image Upload Setup

### Using Cloudinary (Recommended)

1. **Install Cloudinary SDK:**
```bash
npm install cloudinary
```

2. **Configure Cloudinary:**
```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
```

3. **Upload Route:**
```typescript
// app/api/admin/blog/upload/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    const user = await verifyToken(token);
    
    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'hillway/blog',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        filename: file.name,
        size: file.size
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

---

## Environment Variables

Add to your `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Testing the API

### Using cURL

**Create a post:**
```bash
curl -X POST https://admin.hillway.in/api/admin/blog/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "slug": "my-first-post",
    "excerpt": "This is a test post",
    "content": "# Hello World\n\nThis is my first blog post!",
    "category": "adventure",
    "published": true
  }'
```

**Get all published posts:**
```bash
curl https://admin.hillway.in/api/blog/posts
```

---

## Security Considerations

1. **Always validate input data**
2. **Sanitize HTML/Markdown content**
3. **Rate limit upload endpoints**
4. **Verify file types and sizes**
5. **Use HTTPS in production**
6. **Store tokens securely**
7. **Implement CORS properly**

---

For questions or issues, refer to the main BACKEND_ARCHITECTURE.md documentation.
