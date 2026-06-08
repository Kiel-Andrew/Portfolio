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
      <section className="py-4">
        <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
          <p className="text-sm text-zinc-400">Loading tech stack...</p>
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

      <div className="w-full">
        {sortedTechStack.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-zinc-400">No tech stack items yet.</p>
          </div>
        ) : (
          <div className="relative w-full flex overflow-x-hidden">
            {/* Left & Right gradient fades for premium look */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee py-2">
              {marqueeItems.map((tech, index) => (
                <div
                  key={`${tech.id}-${index}`}
                  className="flex items-center gap-3 w-40 h-20 p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-none shrink-0 select-none hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors duration-200 mr-4"
                >
                  {/* Left: Image logo container */}
                  <div className="relative w-12 h-12 shrink-0 bg-white dark:bg-zinc-950/40 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-900/60 p-1">
                    {tech.image ? (
                      <Image
                        src={tech.image}
                        alt={tech.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase">Logo</span>
                    )}
                  </div>

                  {/* Right: Title and Category */}
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                      {tech.name}
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider truncate block mt-0.5">
                      {tech.category}
                    </span>
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