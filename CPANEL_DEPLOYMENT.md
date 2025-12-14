# cPanel Deployment Guide

Complete guide for deploying this Next.js portfolio to cPanel shared hosting.

## Prerequisites

- Node.js 18+ installed on your local machine
- cPanel hosting with File Manager access
- FTP client (optional, but recommended for large uploads)

---

## Quick Deployment (Static Export)

### Step 1: Build Locally

Run the static build command on your local machine:

```bash
npm run build:static
```

This creates an `out` folder with all static files.

### Step 2: Upload to cPanel

#### Option A: Using File Manager

1. Log into your cPanel
2. Open **File Manager**
3. Navigate to `public_html/` (or your domain's root folder)
4. **Delete** all existing files in `public_html/`
5. Upload **ALL contents** from the `out` folder directly into `public_html/`
6. Make sure `.htaccess` is uploaded (enable "Show Hidden Files" in File Manager settings)

#### Option B: Using FTP

1. Connect to your server via FTP (FileZilla, etc.)
2. Navigate to `public_html/`
3. Delete existing files
4. Upload all contents from the `out` folder

### Step 3: Verify Deployment

1. Visit your domain (e.g., `https://yourdomain.com`)
2. Test navigation between pages
3. Test CV showcase URLs (e.g., `https://yourdomain.com/pos`)
4. Test project detail pages

---

## How It Works

### Static Export

The `npm run build:static` command:

- Sets `STATIC_EXPORT=true` environment variable
- Enables Next.js static export mode
- Generates HTML files for all pages
- Creates the `out` folder with deployable files

### .htaccess Configuration

The `.htaccess` file in `public/.htaccess` handles:

1. **CV Showcase Dynamic URLs**

   - URLs like `/pos`, `/ml`, `/ai-workshop` are redirected to `/cv?slug=xxx`
   - The CV page fetches data from your backend API based on the slug

2. **Client-Side Routing**

   - Handles SPA navigation for pages that don't exist as files
   - Falls back to `index.html` for unmatched routes

3. **Performance**

   - GZIP compression for text files
   - Browser caching for static assets

4. **Security**
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection headers

---

## URL Structure

| URL Pattern         | Behavior                      |
| ------------------- | ----------------------------- |
| `/`                 | Home page                     |
| `/about`            | About page                    |
| `/projects`         | Projects list                 |
| `/projects/[slug]`  | Project detail (pre-rendered) |
| `/blogs`            | Blogs list                    |
| `/contact`          | Contact page                  |
| `/cv?slug=xxx`      | CV showcase page              |
| `/pos`, `/ml`, etc. | Redirects to `/cv?slug=xxx`   |
| `/dashboard/*`      | Admin dashboard pages         |

---

## CV Showcase Feature

### How Dynamic CV URLs Work

1. User visits `https://yourdomain.com/pos`
2. `.htaccess` redirects to `/cv?slug=pos`
3. The `/cv` page reads the `slug` query parameter
4. Page fetches CV data from backend API
5. Displays the matching CV showcase

### Setting Up CV URLs

In the dashboard (`/dashboard/cv-config`):

1. Create a new CV showcase
2. Set the "CV URL Path" field (e.g., `pos`, `ml`, `ai-workshop`)
3. The full URL will be `https://yourdomain.com/pos`

---

## Troubleshooting

### 404 Errors on Page Refresh

**Cause:** `.htaccess` not uploaded or `mod_rewrite` not enabled

**Solution:**

1. Verify `.htaccess` is in `public_html/` root
2. Enable "Show Hidden Files" in File Manager to see it
3. Contact your host to enable `mod_rewrite` if needed

### CV Showcase Not Loading

**Cause:** `.htaccess` redirect rules not working

**Solution:**

1. Check `.htaccess` is uploaded correctly
2. Verify the CV URL path matches what's in your backend
3. Test by visiting `/cv?slug=yourpath` directly

### CORS Errors

**Cause:** Backend doesn't allow requests from your domain

**Solution:**
Add your cPanel domain to your backend's CORS whitelist:

```javascript
// In your backend
const allowedOrigins = ["https://yourdomain.com", "https://www.yourdomain.com"];
```

### Images Not Loading

**Cause:** Remote images need to be accessible

**Solution:**

1. Ensure your backend server is running
2. Check image URLs are correct in your data
3. Verify CORS is configured for image requests

### Build Fails with Memory Error

**Cause:** cPanel server has limited memory

**Solution:**

- Always build locally with `npm run build:static`
- Never try to run `npm run build` on cPanel
- Upload only the `out` folder contents

---

## Updating Your Site

To update your deployed site:

1. Make changes to your code locally
2. Run `npm run build:static`
3. Upload the new `out` folder contents to `public_html/`
4. Clear browser cache if needed

---

## Alternative: Node.js App (Not Recommended)

If your cPanel supports Node.js apps, you can try running the full Next.js server. However, this is **not recommended** because:

- cPanel servers often have memory limits that cause build failures
- Static export is faster and more reliable
- No server maintenance required

If you still want to try:

1. Upload entire project to a folder outside `public_html/` (e.g., `~/myapp`)
2. Create Node.js app in cPanel pointing to that folder
3. Set startup file to `.next/standalone/server.js`
4. Run `npm install` and `npm run build` via terminal

**Note:** This often fails due to memory limits on shared hosting.

---

## File Structure After Deployment

```
public_html/
├── .htaccess          # Routing and server config
├── index.html         # Home page
├── 404.html           # 404 error page
├── favicon.ico        # Site favicon
├── sitemap.xml        # SEO sitemap
├── _next/             # Next.js assets (JS, CSS)
├── about/
│   └── index.html
├── blogs/
│   └── index.html
├── contact/
│   └── index.html
├── cv/
│   └── index.html     # CV showcase page
├── dashboard/
│   ├── index.html
│   ├── blogs/
│   ├── cv-config/
│   ├── messages/
│   ├── profile/
│   ├── projects/
│   └── settings/
├── projects/
│   ├── index.html
│   └── [slug]/        # Pre-rendered project pages
├── signin/
│   └── index.html
└── icons/             # Static icons
```

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify your `.htaccess` file is correct
3. Test your backend API is accessible
4. Contact your hosting provider for server-specific issues
