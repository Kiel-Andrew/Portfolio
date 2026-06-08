import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

const adminEmail = process.env.ADMIN_EMAIL || "placeholder@example.com";
const githubId = process.env.GITHUB_ID || "placeholder_id";
const githubSecret = process.env.GITHUB_SECRET || "placeholder_secret";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("DEBUG: NextAuth signIn callback triggered.");
      console.log("GitHub profile email received:", user?.email);
      console.log("Configured ADMIN_EMAIL in environment:", adminEmail);
      
      if (!process.env.ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL is not set in environment.");
        return false;
      }
      
      const isAllowed = user.email === adminEmail;
      console.log("Email comparison result:", isAllowed ? "MATCH (Access Granted)" : "MISMATCH (Access Denied)");
      return isAllowed;
    },
  },
  session: {
    strategy: "jwt", // Use JWT session strategy for stateless Next.js middleware protection
    maxAge: 24 * 60 * 60, // 1 day session duration
  },
};
