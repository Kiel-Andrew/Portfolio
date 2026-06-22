# Portfolio — Full-Stack Next.js 16 Developer Portfolio

A production-ready dual-view developer portfolio with an admin CMS, built with Next.js 16, TypeScript, Prisma, and Supabase.

## Features

- **Dual-View System**: Switch between minimal (typography-driven) and maximized (visual-rich) views
- **Admin CMS**: Protected dashboard for managing projects, experience, certifications, and tech stack
  - Added support for adding/deleting multiple **images** and **videos** to portfolio projects, as well as assigning roles.
- **Database**: Prisma ORM with PostgreSQL (Supabase)
  - Updated schema: projects no longer require slugs, and support rich media fields (`images` & `videos`) and job `role`.
- **Image/Video Hosting**: Supabase Storage (`portfolio` bucket) for project cover images, gallery images, videos, badges, and tech stack icons
- **Authentication**: NextAuth.js with GitHub OAuth (admin-only)
- **Type Safety**: Strict TypeScript with end-to-end type validation
- **Modern Styling**: Tailwind CSS and PostCSS with fully responsive design
- **Production Ready**: Fully linted, compiled, and optimized for Vercel deployment

## Quick Start

### 1. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your Supabase and GitHub OAuth credentials in `.env.local`.

### 2. Initialize Database

Ensure your Supabase project is active, then run:

```bash
npm run db:push
```

### 3. Run Development Server

```bash
npm run dev
```

- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin (sign in with GitHub)

## Deployment on Vercel

### 1. Connect Repository

1. Create a Vercel project linked to your GitHub repository.
2. Build command: `npm run build`
3. Output directory: `.next`
4. Install command: `npm install`

### 2. Add Environment Variables

In Vercel → Project Settings → Environment Variables, add:

```
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL = https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET
GITHUB_ID
GITHUB_SECRET
ADMIN_EMAIL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

*Note: Replace `https://your-vercel-domain.vercel.app` with your actual Vercel domain once assigned.*

### 3. Update GitHub OAuth Callback

Add to your GitHub OAuth App settings:

```
https://your-vercel-domain.vercel.app/api/auth/callback/github
```

### 4. Deploy

Push to the `main` branch — Vercel will automatically rebuild and redeploy!

## Commands

```bash
npm run dev        # Development server (Fast / Turbopack)
npm run build      # Production build (Generates static and dynamic pages)
npm run start      # Start production server locally
npm run lint       # Lint code
npm run db:push    # Sync database schema with Supabase
npm run db:studio  # Prisma Studio database inspector
```

## Project Structure

```
app/
├── (site)/               # Public pages
│  ├── page.tsx          # Home landing page (combines sections)
│  ├── projects/page.tsx
│  ├── experience/page.tsx
│  └── maximized/        # Maximized view pages
├── (admin)/admin/       # Protected admin CMS
│  ├── projects/
│  │  ├── [id]/          # Dynamic route for editing projects
│  │  └── create/        # Project creation route
│  ├── experience/
│  ├── certifications/
│  └── tech-stack/
└── api/                 # Endpoint routes (experiences, projects, etc.)

lib/
├── actions/             # Server actions (CRUD, Supabase Storage uploads)
├── prisma.ts            # Prisma client
├── supabase.ts          # Supabase client
└── view-store.ts        # Zustand state

components/
├── layout/              # Headers, View toggle
├── minimal/             # Minimal section views (Hero, Projects, Experience)
└── admin/               # CMS forms (ProjectForm, ExperienceManager)
```

## Database Schema (Prisma)

Below is the definition of the updated `Project` model in `schema.prisma`:

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String
  content     String?
  coverImage  String
  images      String[] // Gallery images
  videos      String[] // Gallery videos
  role        String?  // Your role on the project
  liveUrl     String?
  githubUrl   String?
  featured    Boolean  @default(false)
  tags        String[] // Tech stack tags
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Admin Access

1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set `ADMIN_EMAIL` to your email address (configured in Vercel/`.env.local`)
3. Sign in at your portfolio domain `/admin` with your GitHub account
4. Only the user matching the `ADMIN_EMAIL` will have access to the CMS

## Troubleshooting

**Database connection failed?**
- Verify `DATABASE_URL` uses the pooler connection (port 6543) and `DIRECT_URL` uses the direct connection.
- Ensure the Supabase project is active and not paused.

**Auth not working?**
- Check GitHub OAuth Client ID and Secret.
- Verify `NEXTAUTH_URL` matches your deployed domain exactly (no trailing slash).
- Confirm your callback URL matches the OAuth registration callback URL on GitHub.

**File/Video uploads failing?**
- Ensure `portfolio` bucket exists in your Supabase project and is set to **Public**.
- Check that your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.

## License

MIT
