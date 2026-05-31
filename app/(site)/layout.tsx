import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiel Andrew | Portfolio",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
