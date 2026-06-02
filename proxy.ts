import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/api/auth/signin",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
