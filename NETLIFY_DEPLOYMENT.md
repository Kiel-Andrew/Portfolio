# Netlify Deployment Guide

## Prerequisites

✅ Build successful locally
✅ Environment variables configured in `.env.local`
✅ Supabase project created with `portfolio` bucket
✅ GitHub OAuth app created

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Deploy portfolio to Netlify"
git push origin main
```

### 2. Create Netlify Site

1. Go to https://netlify.com and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize
4. Choose your `Portfolio` repository
5. Netlify will auto-detect Next.js settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click **Deploy site**

### 3. Add Environment Variables

In Netlify → **Site settings** → **Build & deploy** → **Environment** → **Environment variables**:

Click **"Edit variables"** and add:

```
DATABASE_URL = postgresql://postgres.kagswwdgivkxozicerng:kiel-info333@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
DIRECT_URL = postgresql://postgres:kiel-info333@db.kagswwdgivkxozicerng.supabase.co:5432/postgres
NEXTAUTH_URL = https://YOUR-NETLIFY-DOMAIN.netlify.app
NEXTAUTH_SECRET = 63f4945d921d599f27ae4fdf5bada3f1
GITHUB_ID = Ov23lipoCT2jRUqMIOdN
GITHUB_SECRET = 301c920d5b9eaa8db2b8a53ef31e50dff264e8d2
ADMIN_EMAIL = kielesta.gc@gmail.com
NEXT_PUBLIC_SUPABASE_URL = https://kagswwdgivkxozicerng.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZ3N3d2RnaXZreG96aWNlcm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzU0MjcsImV4cCI6MjA5NTgxMTQyN30.l09GdKfna8pIckMIx6CWb45itGccGJdF0dv7baJPZao
```

**Important:** Replace `YOUR-NETLIFY-DOMAIN` with your actual Netlify domain (e.g., `kiel-andrew-portfolio.netlify.app`)

### 4. Update GitHub OAuth Callback

1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. Update **Authorization callback URL** to:
   ```
   https://YOUR-NETLIFY-DOMAIN.netlify.app/api/auth/callback/github
   ```

### 5. Trigger Deploy

Push to main branch, Netlify will auto-deploy:

```bash
git push origin main
```

Monitor deploy in **Netlify → Deploys** tab. Build should take ~2-3 minutes.

## ✅ Verify Deployment

1. **Site**: Visit `https://YOUR-NETLIFY-DOMAIN.netlify.app`
   - Should see portfolio with dual-view toggle
   - Images from Supabase Storage should load

2. **Admin**: Visit `https://YOUR-NETLIFY-DOMAIN.netlify.app/admin`
   - Click "Sign in with GitHub"
   - Must use email: `kielesta.gc@gmail.com`
   - Should redirect to admin dashboard

3. **Test File Upload**: In admin → Projects → Create Project
   - Select a cover image
   - Fill form and submit
   - Should upload to Supabase Storage bucket and display

## Troubleshooting

### Deploy fails with database error?

- Check env vars in Netlify match `.env.local`
- Ensure `DATABASE_URL` uses pooler (port 6543)
- Verify `NEXTAUTH_URL` has no trailing slash

### Auth not working?

- Check GitHub OAuth callback URL is exactly:
  ```
  https://YOUR-NETLIFY-DOMAIN.netlify.app/api/auth/callback/github
  ```
- Verify `NEXTAUTH_SECRET` is set
- Ensure `ADMIN_EMAIL` matches your GitHub email

### Images not loading?

- Verify Supabase Storage bucket `portfolio` is **public**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

### Build times out?

- Netlify default timeout is 15 minutes (should be fine)
- If stuck, check **Builds** tab for errors
- Try re-triggering deploy from Netlify UI

## Next Steps

1. ✅ Deploy to Netlify (you are here)
2. 🎨 Customize maximized view layouts
3. ✨ Add Framer Motion animations
4. 📊 Add analytics with Vercel Analytics or Plausible
5. 🚀 Set up custom domain (Settings → Custom domain)

## Rollback

If deploy fails, Netlify keeps previous builds. You can:

1. **Netlify UI**: Deploys tab → click previous build → **Publish deploy**
2. **GitHub**: Revert commit and push

Good luck! 🚀
