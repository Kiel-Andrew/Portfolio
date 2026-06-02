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
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error("Failed to fetch projects:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <p className="text-zinc-400">Loading projects...</p>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-12">
            Projects
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">No projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer"
                >
                  <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-4">
                    {project.coverImage && (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {selectedProject.title}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Cover Image */}
              {selectedProject.coverImage && (
                <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Description
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <FiGithub className="w-4 h-4" />
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