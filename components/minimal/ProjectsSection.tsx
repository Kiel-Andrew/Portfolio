"use client";

import { useEffect, useState } from "react";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-2 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
          <p className="text-xs text-zinc-400">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-2 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-8 uppercase tracking-wider">
            Projects
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-zinc-400">No projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer space-y-3"
                >
                  <div className="relative w-full aspect-video overflow-hidden rounded-none bg-zinc-100 dark:bg-zinc-900">
                    {project.coverImage && (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-bold rounded-none"
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
      </section>

      {/* Project Modal - fully monochrome */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                {selectedProject.title}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none transition-colors"
              >
                <FiX className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Cover Image */}
              {selectedProject.coverImage && (
                <div className="relative w-full aspect-video overflow-hidden rounded-none">
                  <Image
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-bold rounded-none text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-bold text-xs shadow-sm"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
                    Live Demo
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs shadow-sm"
                  >
                    <FiGithub className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}