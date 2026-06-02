import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

const adminEmail = process.env.ADMIN_EMAIL || "placeholder@example.com";
const githubId = process.env.GITHUB_ID || "placeholder_id";
const githubSecret = process.env.GITHUB_SECRET || "placeholder_secret";

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
      if (!process.env.ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL is not set in environment.");
        return false;
      }
      return user.email === adminEmail;
    },
  },
});
