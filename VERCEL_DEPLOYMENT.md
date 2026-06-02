# Vercel Deployment Guide

## Prerequisites

✅ SQL tables created in Supabase (using SUPABASE_SQL_SCHEMA.sql)
✅ Environment variables configured in `.env.local`
✅ Code pushed to GitHub

---

## Step-by-Step Deployment

### 1. Create Vercel Account & Project

1. Go to https://vercel.com and sign in
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub **Portfolio** repository
5. Click **"Import"**

### 2. Configure Build Settings

Vercel auto-detects Next.js and sets defaults, but verify:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Add Environment Variables

In **Project Settings** → **Environment Variables**:

Add all variables from your `.env.local`:

```
DATABASE_URL = postgresql://postgres.kagswwdgivkxozicerng:kiel-info333@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
NEXTAUTH_URL = https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET = 63f4945d921d599f27ae4fdf5bada3f1
GITHUB_ID = Ov23lipoCT2jRUqMIOdN
GITHUB_SECRET = 301c920d5b9eaa8db2b8a53ef31e50dff264e8d2
ADMIN_EMAIL = kielesta.gc@gmail.com
NEXT_PUBLIC_SUPABASE_URL = https://kagswwdgivkxozicerng.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZ3N3d2RnaXZreG96aWNlcm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzU0MjcsImV4cCI6MjA5NTgxMTQyN30.l09GdKfna8pIckMIx6CWb45itGccGJdF0dv7baJPZao
```

**IMPORTANT**: Replace `https://your-vercel-domain.vercel.app` with your actual Vercel domain (shown after first deploy).

### 4. Update GitHub OAuth Callback URL

1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. Update **Authorization callback URL** to:
   ```
   https://your-vercel-domain.vercel.app/api/auth/callback/github
   ```

### 5. Deploy

Click **"Deploy"** on Vercel

- Vercel will build and deploy your site
- Takes ~2-3 minutes
- You'll get a domain like: `https://portfolio-xxx.vercel.app`

### 6. Update Environment Variables (Second Pass)

After first deploy, you'll have your actual Vercel domain:

1. Go back to Vercel **Project Settings** → **Environment Variables**
2. Update `NEXTAUTH_URL` with your actual domain:
   ```
   NEXTAUTH_URL = https://portfolio-xxx.vercel.app
   ```
3. Click **"Save"**
4. Go to **Deployments** → click **"Redeploy"** on the latest deployment

### 7. Verify Deployment

- **Site**: https://portfolio-xxx.vercel.app
  - Should see the minimal view with hero, tech stack, projects sections
  - Dark/light mode toggle works
  - Portfolio button disabled (grayed out)

- **Admin**: https://portfolio-xxx.vercel.app/admin
  - Click "Sign in with GitHub"
  - Must use email: `kielesta.gc@gmail.com`
  - Should redirect to admin dashboard

---

## ✅ Troubleshooting

### Auth Not Working?

Check:
1. ✅ `NEXTAUTH_URL` matches your Vercel domain exactly (no trailing slash)
2. ✅ `GITHUB_ID` and `GITHUB_SECRET` are correct
3. ✅ GitHub OAuth callback URL is updated
4. ✅ Admin email is `kielesta.gc@gmail.com`

### Database Connection Failed?

Check:
1. ✅ `DATABASE_URL` uses **pooler** connection (port 6543)
2. ✅ Supabase project is active and tables exist
3. ✅ All env vars are set in Vercel (no typos)

### Images Not Loading?

Check:
1. ✅ Supabase bucket `portfolio` is **public**
2. ✅ `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. ✅ Project cover images and tech stack images are uploaded in admin

### Slow Initial Load?

- First request to Vercel serverless functions can be slow (cold start)
- Subsequent requests will be faster
- Consider upgrading to Pro for faster cold starts

---

## 📝 Post-Deployment Checklist

- [ ] Site loads at vercel domain
- [ ] Dark/light mode toggle works
- [ ] Admin login works with GitHub
- [ ] Can add projects via admin
- [ ] Can add tech stack items
- [ ] Images display correctly
- [ ] Mobile responsive

---

## 🚀 Continuous Deployment

After first deploy, every push to GitHub automatically deploys:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Vercel will automatically rebuild and redeploy! ✨

---

## Custom Domain (Optional)

To use a custom domain (e.g., `kielesta.dev`):

1. In Vercel → **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your custom domain
4. Follow DNS setup instructions
5. Update GitHub OAuth callback URL to use custom domain

---

## Rollback

If something breaks after deploy:

1. Go to Vercel **Deployments** tab
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

---

## Cost

Vercel Free tier includes:
- ✅ Unlimited deployments
- ✅ Unlimited bandwidth
- ✅ Serverless functions (up to limits)
- ✅ Custom domains
- ⚠️ Limited to 12 seconds per function (should be fine for this app)

No costs unless you upgrade to Pro.

