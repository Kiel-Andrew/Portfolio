import { prisma } from "@/lib/prisma";
import ExperienceManager from "@/components/admin/ExperienceManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Experience | Admin",
};

export default async function AdminExperience() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  // Serialize Date objects to strings to prevent Next.js server-to-client component serialization errors
  const serializedExperiences = experiences.map((exp) => ({
    ...exp,
    startDate: exp.startDate.toISOString(),
    endDate: exp.endDate ? exp.endDate.toISOString() : null,
  }));

  return <ExperienceManager initialExperiences={serializedExperiences as any} />;
}
