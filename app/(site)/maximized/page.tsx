import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MaximizedHome() {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    take: 4,
  });

  return (
    <div className="space-y-16">
      <section className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight text-zinc-100">
            Full-Stack Developer
          </h1>
          <p className="max-w-3xl text-xl leading-relaxed text-zinc-300">
            Building high-performance web applications with modern tooling and thoughtful design.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-zinc-800/40 p-6 border border-zinc-700">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Expertise
            </h3>
            <p className="mt-3 text-zinc-100">
              Full-stack development with React, Next.js, and TypeScript.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-800/40 p-6 border border-zinc-700">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Focus
            </h3>
            <p className="mt-3 text-zinc-100">
              Performance, accessibility, and clean code architecture.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-800/40 p-6 border border-zinc-700">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Goal
            </h3>
            <p className="mt-3 text-zinc-100">
              Create lasting value through crafted digital experiences.
            </p>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="space-y-6 border-t border-zinc-800 pt-12">
          <h2 className="text-3xl font-bold text-zinc-100">Featured Work</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-zinc-700 bg-zinc-800/40 overflow-hidden hover:border-zinc-600 transition"
              >
                {project.coverImage && (
                  <div className="relative h-48 w-full bg-zinc-700">
                    {/* Image placeholder - customize with Image component */}
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
