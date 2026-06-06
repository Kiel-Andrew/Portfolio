<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database Schema & CRUD Sync Protocol
- Whenever database fields or CRUD logic are modified in the system:
  1. Immediately update `prisma/schema.prisma` to reflect the exact state of model fields.
  2. Update the corresponding TypeScript interfaces, components, and server actions.
  3. Run `npm run db:push` to apply the changes to the Supabase database.
  4. Build the project (`npm run build`) to ensure type safety.
