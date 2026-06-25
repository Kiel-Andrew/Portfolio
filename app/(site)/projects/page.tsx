import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiStar, FiExternalLink, FiGithub } from "react-icons/fi";
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
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 animate-in fade-in duration-300">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250 transition-colors"
        >
          <FiArrowLeft className="w-4.5 h-4.5" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-900 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
          Projects
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
          A comprehensive list of my work, experiments, and open-source contributions.
        </p>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="rounded-none border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/10 p-12 text-center">
          <p className="text-xs text-zinc-450">No projects yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 hover:border-zinc-450 dark:hover:border-zinc-700 transition-all duration-350 rounded-none shadow-sm"
            >
              <div className="space-y-4">
                {/* Cover Image */}
                {project.coverImage && (
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-350 ease-out group-hover:scale-[1.02]"
                    />

                    {/* Featured Yellow Star Overlay */}
                    {project.featured && (
                      <div 
                        className="absolute top-2.5 right-2.5 bg-yellow-400 text-zinc-950 p-1 shadow-sm flex items-center justify-center border border-yellow-500 z-10"
                        title="Featured Project"
                      >
                        <FiStar className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                      </div>
                    )}
                  </div>
                )}

                {/* Details: Title → Role → Description → Tags */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-colors">
                    {project.title}
                  </h3>

                  {project.role && (
                    <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
                      {project.role}
                    </p>
                  )}

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Tags & Footer Links */}
              <div className="space-y-4 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-900/50">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 font-bold rounded-none border border-zinc-200/50 dark:border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-zinc-800 dark:text-zinc-200 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
                    >
                      <FiExternalLink className="w-3 h-3" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-zinc-800 dark:text-zinc-200 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
                    >
                      <FiGithub className="w-3 h-3" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
