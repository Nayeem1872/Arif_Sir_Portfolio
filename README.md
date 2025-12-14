# Arif Rahim Portfolio

A modern full-stack portfolio website built with [Next.js](https://nextjs.org) and a custom backend API.

Features a complete admin dashboard for managing projects, blogs, CV showcases, and more.

## Features

- **Admin Dashboard** – Full-featured dashboard for managing content
- **Projects Management** – Create, edit, and showcase your projects with images and details
- **Blog System** – Write and publish blog posts with rich text editor
- **CV Showcase** – Dynamic CV pages with custom URLs (e.g., `/pos`, `/ml`)
- **Contact Form** – EmailJS integration for handling messages
- **Responsive Design** – Works seamlessly on all devices
- **SEO Optimized** – Auto-generated sitemap and Open Graph support
- **Static Export** – Deploy to any hosting including cPanel

## Tech Stack

### Frontend

- **Next.js 15** – React framework with App Router
- **TypeScript** – Type-safe development
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Smooth animations
- **Axios** – HTTP client for API calls

### Backend

- Custom REST API (separate repository)
- MongoDB for data storage
- File uploads for images and attachments

### Deployment

- Static export for cPanel hosting
- Vercel-ready for serverless deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (separate repository)
- EmailJS account for contact form

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd arif-sir-portfolio
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_public_key
```

4. **Configure the base URL**

Update `lib/config.ts` with your backend API URL:

```typescript
export const config = {
  baseUrl: "https://your-backend-api.com",
  blogApiBaseUrl: "https://your-backend-api.com/api/blogs",
};
```

5. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Content Management

All content is managed through the admin dashboard at `/dashboard`:

- **Projects** – Add/edit projects with images, technologies, and links
- **Blogs** – Write blog posts with rich text editor
- **CV Showcase** – Create dynamic CV pages with custom URLs
- **Messages** – View contact form submissions
- **Profile** – Update your personal information

Access the dashboard by navigating to `/dashboard` (authentication required).

## Contact Form

The contact form uses **EmailJS** for sending messages.

- Sign up at [emailjs.com](https://www.emailjs.com/)
- Create a service and connect it to an email account
- Create an email template for the contact form.

<details>

<summary>Sample Email Template</summary>

```
Hello,

You’ve received a new message from your website. Here’s what they had to say:

Name: {{name}}
Email: {{email}}

Message:
{{message}}
```

</details>

- Get your EmailJS service ID, template ID, and user ID (public key)
- Add those to your `.env.local` file

## Deploy

Deploy anywhere Next.js is supported:

### Vercel (Recommended)

Make sure to set environment variables in your deployment settings.

### cPanel Static Hosting

For shared hosting with cPanel, use the static export method:

#### Step 1: Build Locally

```bash
npm run build:static
```

This creates an `out` folder with all static files.

#### Step 2: Upload to cPanel

1. Log into your cPanel
2. Open **File Manager**
3. Navigate to `public_html/` (or your domain's root folder)
4. **Delete** all existing files in `public_html/`
5. Upload **ALL contents** from the `out` folder directly into `public_html/`
6. Make sure `.htaccess` is uploaded (enable "Show Hidden Files" in File Manager settings)

#### Step 3: Verify .htaccess

The `.htaccess` file in `public/.htaccess` handles:

- Client-side routing (SPA fallback)
- CV showcase dynamic URLs (e.g., `/pos` → `/cv?slug=pos`)
- GZIP compression
- Browser caching
- Security headers

#### Important Notes

- **No Node.js app needed** - This is a static export, no server required
- **Dynamic routes**: CV showcase URLs like `https://yourdomain.com/pos` are redirected to `/cv?slug=pos` via `.htaccess`
- **Project detail pages**: Work normally at `/projects/[slug]`
- **API calls**: Data is fetched from your backend API at runtime

#### Troubleshooting

**404 Errors on Page Refresh:**

- Verify `.htaccess` is uploaded and in the correct location
- Check if `mod_rewrite` is enabled (contact your host if needed)

**CV Showcase Not Working:**

- Ensure `.htaccess` redirect rules are in place
- Check that the CV URL path matches what's stored in your backend

**CORS Errors:**

- Add your cPanel domain to your backend's CORS whitelist

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (site)/              # Public pages
│   │   ├── about/
│   │   ├── blogs/
│   │   ├── contact/
│   │   └── projects/
│   ├── (dashboard)/         # Admin dashboard
│   │   └── dashboard/
│   │       ├── blogs/
│   │       ├── cv-config/
│   │       ├── messages/
│   │       ├── profile/
│   │       ├── projects/
│   │       └── settings/
│   └── cv/                  # CV showcase page
├── components/              # Reusable components
├── features/               # Feature-specific components
├── lib/                    # Utilities and configurations
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:static` - Build static export for cPanel
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

See [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) for detailed cPanel deployment instructions.

For Vercel deployment, simply connect your repository and set environment variables.

---

Built with ❤️ using Next.js
