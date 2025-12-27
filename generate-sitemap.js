// generate-sitemap.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const DOMAIN = 'https://hillway.in';
const API_BASE = 'https://admin.hillway.in/api';

// Define output paths
const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(PUBLIC_DIR, 'robots.txt');

// --- ROUTE DEFINITIONS ---
// 1. Daily (Homepage)
const dailyRoutes = ['/'];

// 2. Weekly (Destinations & Main Packages List)
const weeklyRoutes = ['/tours', '/destinations'];

// 3. Monthly (Attractions, blogs, Info Pages)
const monthlyRoutes = ['/blog', '/reviews', '/about', '/contact', '/status'];

// 4. Yearly (Legal)
const yearlyRoutes = ['/terms', '/privacy-policy', '/disclaimer'];

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return { success: false, data: [] };
  }
}

async function generate() {
  console.log('🔄 Starting SEO Generation with Custom Rules...');

  // Fetch Dynamic Data
  const [toursData, blogsData] = await Promise.all([
    fetchJson(`${API_BASE}/tours`),
    fetchJson(`${API_BASE}/blogs?published=true`)
  ]);

  const tours = toursData.success ? toursData.data : [];
  const blogs = blogsData.success ? blogsData.data : [];

  // Start XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // --- 1. DAILY (Homepage) ---
  dailyRoutes.forEach(route => {
    sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  });

  // --- 2. WEEKLY (Destinations & Packages) ---
  // Static Weekly Pages
  weeklyRoutes.forEach(route => {
    sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Dynamic Tours (Treat as Packages -> Weekly)
  tours.forEach(tour => {
    const slug = tour.slug || tour._id;
    sitemap += `
  <url>
    <loc>${DOMAIN}/tours/${slug}</loc>
    <lastmod>${tour.updatedAt ? new Date(tour.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // --- 3. MONTHLY (Attractions / blogs / Info) ---
  // Static Monthly Pages
  monthlyRoutes.forEach(route => {
    sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Dynamic blog Posts (Treat as Monthly)
  blogs.forEach(blog => {
    const slug = blog.slug || blog._id;
    sitemap += `
  <url>
    <loc>${DOMAIN}/blog/${slug}</loc>
    <lastmod>${blog.date ? new Date(blog.date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // --- 4. YEARLY (Legal) ---
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

  // Write Sitemap
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`✅ Sitemap generated at: ${SITEMAP_PATH}`);

  // Write Robots.txt
  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemap
Sitemap: ${DOMAIN}/sitemap.xml
`;

  fs.writeFileSync(ROBOTS_PATH, robots);
  console.log(`✅ Robots.txt generated at: ${ROBOTS_PATH}`);
}

generate();