# Cleanup Instructions

## Folders to Remove

Once you've verified the new blog structure works, manually delete these folders:

### 1. Remove Next.js Blog Folder
```bash
git rm -r blog/
git commit -m "Remove Next.js blog folder - migrated to React"
```

### 2. Remove Backend Folder (Optional)
If using serverless/Firebase:
```bash
git rm -r backend/
git commit -m "Remove backend folder - moved to serverless"
```

If keeping backend separate, you can:
- Move it to a separate repository
- Deploy it to Railway/Render
- Keep it but update frontend API URLs

### 3. Remove Deployment Zips
```bash
git rm deploy.zip update.zip
git commit -m "Remove unnecessary deployment zips"
```

### 4. Remove Duplicate Deploy/Update Folders
```bash
git rm -r deploy/ update/
git commit -m "Remove duplicate deployment folders"
```

## All-in-One Cleanup Command

Run this locally to clean everything at once:

```bash
# Remove all old folders
git rm -r blog/ backend/ deploy/ update/
git rm deploy.zip update.zip

# Commit the changes
git commit -m "Complete cleanup: remove Next.js blog, backend, and deployment artifacts"

# Push to your branch
git push origin restructure-to-single-react-app
```

## Verification Before Cleanup

Before deleting, verify:
- [ ] Blog routes work: `/blog` and `/blog/:slug`
- [ ] Blog posts display correctly
- [ ] Images load properly
- [ ] No console errors
- [ ] Build succeeds: `npm run build`
- [ ] Backend functionality replaced or moved

## After Cleanup

1. **Merge to main**:
   ```bash
   git checkout main
   git merge restructure-to-single-react-app
   git push origin main
   ```

2. **Deploy to hosting**:
   - Vercel: Auto-deploys on push to main
   - Netlify: Configure build settings
   - Firebase: Run `firebase deploy`

3. **Update README.md** with new structure

## Why Manual Deletion?

GitHub API doesn't support deleting entire directories in a single operation. Manual deletion via git commands is faster and cleaner.

## Questions?

Refer to MIGRATION_GUIDE.md for complete migration details.
