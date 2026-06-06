import TechStackManager from "@/components/admin/TechStackManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Tech Stack | Admin",
};

export default async function AdminTechStack() {
  const techStack = await prisma.techStack.findMany({
    orderBy: { category: "asc" },
  });

  return <TechStackManager initialTechStack={techStack} />;
}
