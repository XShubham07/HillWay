import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import Page from '@/models/Page';

const DOMAIN = 'https://hillway.in';

// Static routes configuration
const dailyRoutes = ['/'];
const weeklyRoutes = ['/tours', '/destinations'];
const monthlyRoutes = ['/blog', '/reviews', '/about', '/contact', '/status'];
const yearlyRoutes = ['/terms', '/privacy-policy', '/disclaimer'];

export async function GET() {
  const conn = await dbConnect();

  try {
    // Fetch tours and pages using models
    const [tours, pages] = await Promise.all([
      Tour.find({}).select('slug _id updatedAt').lean(),
      Page.find({ isActive: true }).select('slug updatedAt').lean()
    ]);

    // Fetch blogs directly from collection (no model)
    const db = conn.connection.db;
    const blogs = await db.collection('blogs')
      .find({ published: true })
      .project({ slug: 1, _id: 1, date: 1, updatedAt: 1 })
      .toArray();

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 1. Daily Routes (Homepage)
    dailyRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    });

    // 2. Weekly Static Routes
    weeklyRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // 3. Dynamic Tours
    tours.forEach(tour => {
      const slug = tour.slug || tour._id;
      const lastmod = tour.updatedAt ? new Date(tour.updatedAt).toISOString() : new Date().toISOString();
      sitemap += `
  <url>
    <loc>${DOMAIN}/tours/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // 4. Dynamic SEO Pages (Root level)
    pages.forEach(page => {
      if (!page.slug) return;
      const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString() : new Date().toISOString();
      sitemap += `
  <url>
    <loc>${DOMAIN}/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    });

    // 5. Monthly Static Routes
    monthlyRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // 6. Dynamic Blogs
    blogs.forEach(blog => {
      const slug = blog.slug || blog._id;
      const lastmod = blog.updatedAt || blog.date ? new Date(blog.updatedAt || blog.date).toISOString() : new Date().toISOString();
      sitemap += `
  <url>
    <loc>${DOMAIN}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // 7. Yearly Static Routes (Legal)
    yearlyRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>`;
    });

    // Close XML
    sitemap += `
</urlset>`;

    return NextResponse.json({
      success: true,
      data: {
        xml: sitemap,
        stats: {
          tours: tours.length,
          pages: pages.length,
          blogs: blogs.length,
          staticRoutes: dailyRoutes.length + weeklyRoutes.length + monthlyRoutes.length + yearlyRoutes.length,
          totalUrls: tours.length + pages.length + blogs.length + dailyRoutes.length + weeklyRoutes.length + monthlyRoutes.length + yearlyRoutes.length
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
