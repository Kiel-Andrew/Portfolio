import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Tech Stack | Admin",
};

export default async function AdminTechStack() {
  const techStack = await prisma.techStack.findMany({
    orderBy: { category: "asc" },
  });

  const groupedByCategory = techStack.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, typeof techStack>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-100">Tech Stack</h1>
          <p className="text-zinc-400">Manage your technical skills</p>
        </div>
        <Link
          href="/admin/tech-stack/create"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-zinc-700 rounded-lg hover:bg-zinc-600 transition"
        >
          Add Technology
        </Link>
      </div>

      {techStack.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-12 text-center">
          <p className="text-zinc-400">No technologies added yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByCategory).map(([category, techs]) => (
            <div key={category} className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-200">
                {category}
              </h2>
              <div className="space-y-2">
                {techs.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/40 p-4 hover:bg-zinc-800/60 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-100">
                        {tech.name}
                      </h3>
                      <p className="text-xs text-zinc-500">{tech.iconName}</p>
                    </div>
                    {tech.proficiency && (
                      <div className="text-sm font-medium text-zinc-400">
                        {tech.proficiency}%
                      </div>
                    )}
                    <a
                      href={`/admin/tech-stack/${tech.id}`}
                      className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
                    >
                      Edit
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
