"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface TechStackItem {
  id: string;
  name: string;
  category: string;
  image?: string | null;
}

async function fetchTechStack(): Promise<TechStackItem[]> {
  try {
    const response = await fetch("/api/tech-stack");
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("API did not return an array:", data);
      return []; 
    }
  } catch (error) {
    console.error("Failed to fetch tech stack:", error);
    return [];
  }
}

export default function TechStackCarousel() {
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechStack().then((data) => {
      setTechStack(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-6 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
          <div className="flex gap-4 overflow-hidden py-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-28 h-28 border border-zinc-200/55 dark:border-zinc-800/40 bg-zinc-50/20 dark:bg-zinc-900/10 backdrop-blur-md rounded-none shrink-0 animate-pulse flex flex-col items-center justify-between p-3"
              >
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-none" />
                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-none" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const safeTechStack = Array.isArray(techStack) ? techStack : [];

  // Group by category order: Development -> Database -> Design -> Tools
  const categoryOrder = ["Development", "Database", "Design", "Tools"];

  // Sort: category order first, then alphabetical within category
  const sortedTechStack = [...safeTechStack].sort((a, b) => {
    const idxA = categoryOrder.indexOf(a.category);
    const idxB = categoryOrder.indexOf(b.category);
    
    const weightA = idxA === -1 ? 999 : idxA;
    const weightB = idxB === -1 ? 999 : idxB;
    
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    return a.name.localeCompare(b.name);
  });

  // Duplicate the sorted list to ensure seamless infinite looping marquee
  const marqueeItems = [...sortedTechStack, ...sortedTechStack];

  return (
    <section className="py-6 bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-hidden relative">
      {/* Scoped CSS for hardware accelerated infinite marquee with pause-on-hover */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        {sortedTechStack.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-zinc-400">No tech stack items yet.</p>
          </div>
        ) : (
          <div className="relative w-full flex overflow-x-hidden">
            {/* Left & Right gradient fades for premium look */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee py-2">
              {marqueeItems.map((tech, index) => (
                <div
                  key={`${tech.id}-${index}`}
                  className="flex flex-col items-center justify-between w-28 h-28 p-3 border border-zinc-200/55 dark:border-zinc-800/40 bg-zinc-50/20 dark:bg-zinc-900/10 backdrop-blur-md rounded-none shrink-0 select-none hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-all duration-200 mr-4"
                >
                  {/* Top: Name */}
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate block text-center w-full">
                    {tech.name}
                  </span>

                  {/* Bottom: Image container (transparent background) */}
                  <div className="relative w-12 h-12 shrink-0 bg-transparent flex items-center justify-center overflow-hidden p-0">
                    {tech.image ? (
                      <Image
                        src={tech.image}
                        alt={tech.name}
                        fill
                        sizes="48px"
                        className="object-contain opacity-80 dark:opacity-75 hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase">Logo</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}