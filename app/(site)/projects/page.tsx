import Image from "next/image";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects | Kiel Andrew",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
          Projects
        </h1>
        <p className="text-lg text-zinc-600">
          A selection of work I&apos;m proud of.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center">
          <p className="text-zinc-500">No projects yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.liveUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group block space-y-3 overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 transition hover:border-zinc-400 hover:shadow-md"
            >
              {project.coverImage && (
                <div className="relative mb-4 h-40 w-full overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold text-zinc-950">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-600">{project.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
