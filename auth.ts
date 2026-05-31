import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

const adminEmail = process.env.ADMIN_EMAIL;
const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

if (!adminEmail) {
  throw new Error("ADMIN_EMAIL is not set.");
}

if (!githubId || !githubSecret) {
  throw new Error("GITHUB_ID or GITHUB_SECRET is not set.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
  ],
  callbacks: {
    signIn({ user }) {
      return user.email === adminEmail;
    },
  },
});
