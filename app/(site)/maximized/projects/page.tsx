import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MaximizedProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-zinc-100">Projects</h1>
        <p className="text-xl text-zinc-400">
          A curated selection of work I&apos;m proud of.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-12 text-center">
          <p className="text-zinc-400">No projects available yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl border border-zinc-700 bg-zinc-800/40 overflow-hidden hover:border-zinc-600 transition"
            >
              {project.coverImage && (
                <div className="relative h-56 w-full bg-gradient-to-br from-zinc-800 to-zinc-900">
                  {/* Image placeholder - customize layout here */}
                </div>
              )}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-zinc-50 transition">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-400">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-zinc-300 bg-zinc-700/50 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
