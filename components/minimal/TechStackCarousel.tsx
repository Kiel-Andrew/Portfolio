"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface TechStackItem {
  id: string;
  name: string;
  category: string;
  image?: string | null;
  proficiency?: number | null;
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
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <p className="text-sm text-zinc-400">Loading tech stack...</p>
        </div>
      </section>
    );
  }

  const safeTechStack = Array.isArray(techStack) ? techStack : [];

  // Group by category safely
  const groupedByCategory = safeTechStack.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, TechStackItem[]>
  );

  return (
    <section className="py-2 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="space-y-4">
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {category}
              </h3>
              
              {/* Horizontal scrolling carousel - borderless items */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4 min-w-max">
                  {items.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      {tech.image ? (
                        <div className="w-10 h-10 relative">
                          <Image
                            src={tech.image}
                            alt={tech.name}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-none flex items-center justify-center">
                          <span className="text-[10px] text-zinc-500">Icon</span>
                        </div>
                      )}
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 text-center">
                        {tech.name}
                      </span>
                      {tech.proficiency && (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                          {tech.proficiency}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {safeTechStack.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-zinc-400">No tech stack items yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}