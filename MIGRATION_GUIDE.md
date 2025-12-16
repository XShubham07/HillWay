# HillWay Migration Guide: Single React App

## Overview
This guide explains the restructuring of HillWay from a multi-folder setup (Next.js blog + Backend + React frontend) to a single consolidated React application.

## What Changed

### ✅ Completed
1. **Blog Migration**: Converted Next.js blog to React components
2. **Component Structure**: Created new blog components in `src/components/blog/`
3. **Pages Added**: 
   - `src/pages/Blog.jsx` - Blog listing page
   - `src/pages/BlogPost.jsx` - Individual blog post page
4. **Utilities**: Added `src/utils/blogUtils.js` for blog operations
5. **Data**: Created `src/data/blogPosts.json` with sample blog posts
6. **Routes**: Updated `src/App.jsx` with `/blog` and `/blog/:slug` routes
7. **Dependencies**: Added `date-fns` and `react-markdown` to package.json

### 📁 New Structure
```
src/
├── components/
│   └── blog/
│       └── BlogCard.jsx        # Blog card component
├── pages/
│   ├── Blog.jsx                # Blog listing page
│   └── BlogPost.jsx            # Single blog post page
├── utils/
│   └── blogUtils.js            # Blog utility functions
└── data/
    └── blogPosts.json          # Blog posts data
```

## Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Test the Blog
Run your development server:
```bash
npm run dev
```

Visit:
- `http://localhost:5173/blog` - Blog listing
- `http://localhost:5173/blog/discover-mountain-paradise` - Sample blog post

### 3. Migrate Your Blog Content

If you have existing blog posts in `blog/content/posts/`, you need to:

**Option A: JSON Format (Recommended)**
1. Convert markdown files to JSON entries
2. Add them to `src/data/blogPosts.json`

**Option B: Keep Markdown Files**
1. Move markdown files to `public/blog-content/`
2. Update `blogUtils.js` to fetch and parse markdown files
3. Install `gray-matter` for frontmatter parsing:
   ```bash
   npm install gray-matter
   ```

### 4. Handle Backend Functionality

You have two options:

**Option A: Serverless (Firebase/Supabase)**
- Recommended for static hosting (Vercel, Netlify)
- Replace backend API calls with Firebase/Supabase
- Use Firebase Auth, Firestore, and Cloud Functions

**Option B: Separate Backend Hosting**
- Keep backend folder separate
- Deploy backend to Railway, Render, or Vercel
- Update frontend API endpoints to point to hosted backend URL
- Example: Change `http://localhost:5000/api` to `https://your-backend.railway.app/api`

### 5. Update API Endpoints (If keeping backend)

Create `src/config/api.js`:
```javascript
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api';
```

### 6. Add Blog Images

Place blog images in:
```
public/
└── images/
    └── blog/
        ├── mountain-paradise.jpg
        ├── trekking-routes.jpg
        ├── local-cuisine.jpg
        └── winter-wonderland.jpg
```

### 7. Clean Up Old Folders

Once you've verified everything works, you can delete:
- `/blog` folder (Next.js blog)
- `/backend` folder (if using serverless)
- `deploy.zip` and `update.zip`

## Blog Features

### Current Features
- ✅ Blog listing with grid layout
- ✅ Featured post display
- ✅ Category filtering
- ✅ Individual blog post pages
- ✅ Markdown content rendering
- ✅ Reading time display
- ✅ Author information
- ✅ Responsive design

### To Add (Optional)
- 🔲 Search functionality
- 🔲 Tags system
- 🔲 Related posts
- 🔲 Comments section
- 🔲 Social sharing buttons
- 🔲 RSS feed

## Hosting Options

### Vercel (Recommended)
1. Connect your GitHub repository
2. Vercel auto-detects Vite configuration
3. Deploy with one click
4. Environment variables for API URLs

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add `_redirects` file for SPA routing:
   ```
   /*    /index.html   200
   ```

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

## Troubleshooting

### Issue: Blog posts not showing
- Check `src/data/blogPosts.json` exists
- Verify JSON syntax is correct
- Check browser console for errors

### Issue: Blog images not loading
- Ensure images are in `public/images/blog/`
- Check image paths in JSON match file locations
- Try absolute paths: `/images/blog/image.jpg`

### Issue: Routing not working after deployment
- Add redirect rules for SPA routing
- Vercel: Add `vercel.json` with rewrites
- Netlify: Add `_redirects` file

## Support

For issues or questions:
1. Check the console for error messages
2. Review this migration guide
3. Test locally before deploying

## Migration Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Test blog locally
- [ ] Migrate blog content to JSON
- [ ] Add blog images to public folder
- [ ] Test all blog routes
- [ ] Decide on backend strategy (serverless vs separate)
- [ ] Update API endpoints if needed
- [ ] Test build (`npm run build`)
- [ ] Deploy to hosting platform
- [ ] Delete old folders once verified
- [ ] Update README.md with new structure

Good luck with your migration! 🚀
