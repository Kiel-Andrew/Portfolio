# Portfolio — Full-Stack Next.js 14 Developer Portfolio

A production-ready dual-view developer portfolio with admin CMS, built with Next.js 14, TypeScript, Prisma, and Supabase.

## Features

- **Dual-View System**: Switch between minimal (typography-driven) and maximized (visual-rich) views
- **Admin CMS**: Protected dashboard for managing projects, experience, certifications, and tech stack
- **Database**: Prisma ORM with PostgreSQL (Supabase)
- **Image Hosting**: Supabase Storage for project covers and badge uploads
- **Authentication**: NextAuth.js with GitHub OAuth (admin-only)
- **Type Safety**: Strict TypeScript with end-to-end type validation
- **Modern Styling**: Tailwind CSS with responsive design
- **Production Ready**: Fully linted, optimized, and ready for deployment

## Quick Start

### 1. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your Supabase and GitHub OAuth credentials in `.env.local`.

### 2. Initialize Database

```bash
npm run db:push
```

### 3. Run Development Server

```bash
npm run dev
```

- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin (sign in with GitHub)

## Deployment on Netlify

### 1. Connect Repository

1. Create a Netlify site linked to this GitHub repo
2. Build command: `npm run build`
3. Publish directory: `.next`

### 2. Add Environment Variables

In Netlify → Site settings → Build & deploy → Environment:

```
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL=https://your-netlify-domain.netlify.app
NEXTAUTH_SECRET
GITHUB_ID
GITHUB_SECRET
ADMIN_EMAIL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Update GitHub OAuth Callback

Add to GitHub OAuth App settings:

```
https://your-netlify-domain.netlify.app/api/auth/callback/github
```

### 4. Deploy

Push to main branch — Netlify will auto-deploy.

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Lint code
npm run db:push    # Sync database schema
npm run db:studio  # Prisma Studio UI
```

## Project Structure

```
app/
├── (site)/               # Public pages
│  ├── page.tsx          # Home
│  ├── projects/page.tsx
│  ├── experience/page.tsx
│  └── maximized/        # Maximized view pages
├── (admin)/admin/       # Protected admin CMS
│  ├── projects/
│  ├── experience/
│  ├── certifications/
│  └── tech-stack/
└── api/auth/            # NextAuth routes

lib/
├── actions/             # Server actions
├── prisma.ts            # Prisma client
├── supabase.ts          # Supabase client
└── view-store.ts        # Zustand state

components/
├── layout/              # Headers, View toggle
├── views/               # Minimal & Maximized shells
└── admin/               # CMS forms
```

## Admin Access

1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set `ADMIN_EMAIL` to your email address
3. Sign in at http://localhost:3000/admin with your GitHub account
4. Only the admin email can access the CMS

## Environment Variables

```env
# Database (from Supabase)
DATABASE_URL="postgresql://user:password@host/db"
DIRECT_URL="postgresql://user:password@host/db"

# NextAuth
NEXTAUTH_URL="https://yourdomain.netlify.app"
NEXTAUTH_SECRET="random-32-byte-secret"

# GitHub OAuth
GITHUB_ID="your-client-id"
GITHUB_SECRET="your-client-secret"

# Admin
ADMIN_EMAIL="your-email@example.com"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Troubleshooting

**Database connection failed?**
- Verify DATABASE_URL and DIRECT_URL from Supabase
- Ensure the Supabase project is active

**Auth not working?**
- Check GitHub OAuth Client ID and Secret
- Verify NEXTAUTH_URL matches your domain
- Confirm callback URL in GitHub settings

**File uploads failing?**
- Ensure `portfolio` bucket exists and is public in Supabase
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct

## Next Steps

1. ✅ Configure `.env.local`
2. ✅ Run `npm run db:push`
3. ✅ Test locally with `npm run dev`
4. ✅ Deploy to Netlify
5. 🎨 Customize maximized view layouts
6. ✨ Add animations with Framer Motion/GSAP

## License

MIT
