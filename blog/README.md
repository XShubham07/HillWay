# HillWay Blog

SEO-optimized Next.js blog for HillWay travel website.

## Features
- Dynamic meta tags & Open Graph
- Auto-generated sitemap
- RSS feed
- MDX blog posts
- Reading time estimation
- Matching brand design

## Development

```bash
cd blog
npm install
npm run dev
```

Visit http://localhost:3001

## Adding Blog Posts

Create a new `.md` file in `content/posts/`:

```markdown
---
title: "Your Post Title"
date: "2024-12-15"
author: "HillWay Team"
excerpt: "Short description"
category: "Travel Tips"
coverImage: "/images/post.jpg"
tags: ["hiking", "mountains"]
---

Your content here...
```

## Deployment

Deploy to Vercel:
1. Connect repo
2. Set root directory to `blog`
3. Deploy to `blog.hillway.in`

## Structure

```
blog/
├── app/              # Next.js App Router
│   ├── layout.tsx    # SEO metadata
│   ├── page.tsx      # Blog home
│   ├── [slug]/       # Dynamic post pages
│   ├── sitemap.ts    # Auto sitemap
│   └── rss.xml/      # RSS feed
├── components/       # React components
├── content/posts/    # Blog posts (MDX)
├── lib/             # Utilities
└── public/          # Static assets
```