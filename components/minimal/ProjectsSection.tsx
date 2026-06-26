"use client";

import { useEffect, useState, useRef } from "react";
import { FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  images?: string[];
  videos?: string[];
  role?: string;
  featured?: boolean;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(300);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const scrollAmount = 300;
      galleryRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (lightboxIndex === null || !selectedProject || !selectedProject.images) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev - 1 + selectedProject.images!.length) % selectedProject.images!.length : null
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev + 1) % selectedProject.images!.length : null
        );
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, selectedProject]);

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

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth >= 768) {
        setCardWidth(440);
      } else if (window.innerWidth >= 640) {
        setCardWidth(380);
      } else {
        setCardWidth(280);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (projects.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [projects.length, isHovered, activeIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handleCardClick = (project: Project, index: number) => {
    if (index === activeIndex) {
      setSelectedProject(project);
    } else {
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none mb-8" />
          <div className="flex justify-center items-center py-6">
            <div className="w-full max-w-md space-y-3">
              <div className="relative w-full aspect-video bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none" />
              <div className="space-y-2">
                <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none" />
                <div className="h-3.5 w-1/4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none" />
                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none" />
                <div className="flex gap-2 pt-1">
                  <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none" />
                  <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-white dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-8 uppercase tracking-wider">
            Projects
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-zinc-400">No projects yet.</p>
            </div>
          ) : (
            <div 
              className="relative w-full flex items-center justify-center min-h-[360px] xs:min-h-[380px] sm:min-h-[440px] md:min-h-[480px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Carousel Viewport */}
              <div className="w-full overflow-hidden py-4 flex items-center">
                <div
                  className="flex items-center gap-6 transition-transform duration-500 ease-out"
                  style={{
                    width: `${projects.length * (cardWidth + 24)}px`,
                    transform: `translateX(calc(50% - ${activeIndex} * (${cardWidth}px + 24px) - ${cardWidth / 2}px))`,
                  }}
                >
                  {projects.map((project, index) => {
                    const isActive = index === activeIndex;
                    const isLeft = projects.length >= 3 && index === (activeIndex - 1 + projects.length) % projects.length;
                    const isRight = index === (activeIndex + 1) % projects.length;

                    let cardClass = "transition-all duration-500 ease-in-out shrink-0 relative ";
                    if (isActive) {
                      cardClass += "scale-100 opacity-100 z-10 cursor-pointer";
                    } else if (isLeft || isRight) {
                      cardClass += "scale-90 opacity-30 z-0 cursor-pointer hidden sm:block";
                    } else {
                      cardClass += "scale-75 opacity-0 z-0 pointer-events-none hidden sm:block";
                    }

                    return (
                      <div
                        key={project.id}
                        onClick={() => handleCardClick(project, index)}
                        className={`${cardClass} group space-y-3`}
                        style={{ width: `${cardWidth}px` }}
                      >
                        <div className="relative w-full aspect-video overflow-hidden rounded-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          {project.coverImage && (
                            <Image
                              src={project.coverImage}
                              alt={project.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                            />
                          )}

                          {/* Yellow Star Overlay for Featured projects */}
                          {project.featured && (
                            <div 
                              className="absolute top-2 right-2 bg-yellow-400 text-zinc-950 p-1 shadow-sm flex items-center justify-center border border-yellow-500 z-10"
                              title="Featured Project"
                            >
                              <FiStar className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                            </div>
                          )}
                        </div>

                        {/* Title → Role → Description → Tags */}
                        <div className="space-y-1.5 text-left">
                          <h3 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-650 dark:group-hover:text-zinc-300 transition-colors">
                            {project.title}
                          </h3>

                          {project.role && (
                            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
                              {project.role}
                            </p>
                          )}

                          <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed font-normal line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex gap-2 pt-0.5 flex-wrap">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 font-bold rounded-none border border-zinc-200/50 dark:border-zinc-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              {projects.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 md:left-4 z-20 p-2 bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-950 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 transition-colors duration-300 shadow-sm"
                    aria-label="Previous project"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 md:right-4 z-20 p-2 bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-950 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 transition-colors duration-300 shadow-sm"
                    aria-label="Next project"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* View All Projects Button */}
          {projects.length > 0 && (
            <div className="flex justify-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-zinc-800 dark:border-zinc-200 hover:bg-zinc-950 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 transition-colors duration-300 text-xs font-bold uppercase tracking-wider rounded-none"
              >
                View All Projects
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Project Modal - fully monochrome */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                {selectedProject.title}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Cover Image */}
              {selectedProject.coverImage && (
                <div className="relative w-full aspect-video overflow-hidden rounded-none border border-zinc-100 dark:border-zinc-800">
                  <img
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Role */}
              {selectedProject.role && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                    Role
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {selectedProject.role}
                  </p>
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

              {/* Gallery Images Slider */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                    Gallery
                  </h3>
                  <div className="relative w-full group/gallery">
                    <div
                      ref={galleryRef}
                      className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1.5 px-1 scroll-smooth snap-x"
                    >
                      {selectedProject.images.map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxIndex(i)}
                          className="shrink-0 w-32 xs:w-36 sm:w-44 aspect-square overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 cursor-pointer snap-start transition-opacity hover:opacity-90"
                        >
                          <img
                            src={imgUrl}
                            alt={`${selectedProject.title} gallery image ${i + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Gallery Nav Buttons */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => scrollGallery("left")}
                          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-950 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 transition-colors duration-300 shadow-md cursor-pointer opacity-0 group-hover/gallery:opacity-100 transition-opacity"
                          aria-label="Scroll left"
                        >
                          <FiChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollGallery("right")}
                          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-950 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 transition-colors duration-300 shadow-md cursor-pointer opacity-0 group-hover/gallery:opacity-100 transition-opacity"
                          aria-label="Scroll right"
                        >
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Gallery Videos */}
              {selectedProject.videos && selectedProject.videos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                    Videos
                  </h3>
                  <div className="space-y-4">
                    {selectedProject.videos.map((vidUrl, i) => (
                      <div key={i} className="border border-zinc-200 dark:border-zinc-800 bg-black">
                        <video
                          src={vidUrl}
                          controls
                          className="w-full aspect-video object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

      {/* Lightbox Modal */}
      {lightboxIndex !== null && selectedProject && selectedProject.images && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-6 select-none animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between w-full">
            <div className="bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 font-bold uppercase tracking-wider">
              {lightboxIndex + 1} / {selectedProject.images.length}
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image with Nav Buttons */}
          <div className="flex-1 flex items-center justify-between w-full gap-4 relative py-4">
            {/* Left navigation */}
            {selectedProject.images.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => 
                  prev !== null ? (prev - 1 + selectedProject.images!.length) % selectedProject.images!.length : null
                )}
                className="p-3 sm:p-4 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 text-white transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Centered Image */}
            <div className="flex-1 flex items-center justify-center h-full max-h-[75vh]">
              <img
                src={selectedProject.images[lightboxIndex]}
                alt={`${selectedProject.title} lightbox image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain border border-zinc-900 shadow-2xl"
              />
            </div>

            {/* Right navigation */}
            {selectedProject.images.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => 
                  prev !== null ? (prev + 1) % selectedProject.images!.length : null
                )}
                className="p-3 sm:p-4 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 text-white transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom guidelines */}
          <div className="flex justify-center w-full">
            <div className="text-zinc-550 dark:text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-zinc-900/40 border border-zinc-900/30 py-1.5 px-4">
              Use arrow keys to navigate • ESC to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}