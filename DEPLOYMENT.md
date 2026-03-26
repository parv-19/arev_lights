# AREV Lights Deployment Guide

## Recommended Hosting

This repository is a single Next.js application with:

- public marketing site
- admin dashboard
- API routes
- MongoDB persistence
- Cloudinary media uploads

The cleanest production deployment is:

- Vercel for the full app
- MongoDB Atlas for the database
- Cloudinary for asset storage
- `arevlights.com` as the primary custom domain

Render can also host the app as a Node web service using [`render.yaml`](/d:/arev_lights/render.yaml), but Vercel is the better fit for this architecture.

## Required Environment Variables

Copy [`.env.example`](/d:/arev_lights/.env.example) and set:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_ADMIN_NAME`

## Vercel Setup

1. Import the repository into Vercel.
2. Set the framework preset to Next.js.
3. Add all required environment variables for Production, Preview, and Development as needed.
4. Set the production domain to `arevlights.com`.
5. Add `www.arevlights.com` and redirect it to `https://arevlights.com` if desired.
6. Redeploy after env vars are saved.

## Render Setup

1. Create a new Web Service from this repository.
2. Let Render detect [`render.yaml`](/d:/arev_lights/render.yaml).
3. Provide the same environment variables used for Vercel.
4. Point the custom domain to the Render service only if you intend to run the whole app there instead of Vercel.

## Post-Deploy Checklist

- Confirm `/api/auth/session` returns a valid response in production.
- Confirm admin login works at `/admin/login`.
- Confirm uploads succeed through Cloudinary.
- Confirm `robots.txt` and `sitemap.xml` resolve successfully.
- Seed the first admin user with `npm run seed:admin`.
- Verify MongoDB Atlas network access allows the hosting platform.
