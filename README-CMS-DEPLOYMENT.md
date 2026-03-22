# Sarko Decor - CMS and Deployment Guide

## Architecture Overview
This application is built using **Next.js (App Router)** and **Tailwind CSS**, optimized for extremely fast performance. It leverages Next.js native Image optimization to handle thousands of gallery photos without slowing down the site.

Currently, the data is statically mocked inside `src/data/projects.ts` to simulate a Headless CMS approach.

## How to Manage Content

### Approach 1: Developer-led Static Management (Current)
To add a new project right now:
1. Upload your images to an S3 bucket or a service like Cloudinary (or use the `public` folder).
2. Open `src/data/projects.ts`.
3. Add a new object to the `projects` array following the existing format.

### Approach 2: Integrating a Headless CMS (Recommended)
For non-technical admin users to upload thousands of photos easily, we strongly recommend connecting this frontend to **Sanity.io** or **Strapi**.

**Why Sanity?**
- Excellent, customizable React-based studio.
- Image CDN built-in with automatic transformations (crop, hotspot).
- Next.js has first-class integration with Sanity.

**Integration Steps for Sanity:**
1. Run `npm create sanity@latest` inside a new folder (e.g., `studio`).
2. Create schemas for `Project` (Title, Category, Tags, Location, Duration, CoverImage, GalleryImages).
3. In this Next.js project, install next-sanity: `npm install next-sanity`.
4. Delete `src/data/projects.ts` and replace it with a Sanity GROQ query fetching data inside `src/app/gallery/page.tsx` and `src/app/projects/[id]/page.tsx`.
5. Update `next.config.ts` to allow `cdn.sanity.io` in the remotePatterns array.

## Deployment Guide

We recommend deploying this Next.js application on **Vercel** for zero-configuration, global CDN, and automatic Edge caching.

1. **Push to GitHub**: Initialize a Git repository and push your code to GitHub.
2. **Import to Vercel**: 
   - Go to [Vercel.com](https://vercel.com).
   - Click "Add New Project" and authorize your GitHub account.
   - Select the `sarko_decor` repository.
3. **Configure Settings**:
   - Framework preset will automatically be set to **Next.js**.
   - Build Command: `npm run build`
   - Install Command: `npm install`
4. **Deploy**: Click the Deploy button. Vercel will automatically configure the image optimization Edge network to handle thousands of your photos at blazing speeds.
