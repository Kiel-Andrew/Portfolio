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

// FIX 1: Ensure the fetcher ALWAYS returns an array, even if the API sends back an object/error
async function fetchTechStack(): Promise<TechStackItem[]> {
  try {
    const response = await fetch("/api/tech-stack");
    const data = await response.json();
    
    // Check if data is actually an array before returning it
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
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <p className="text-zinc-400">Loading tech stack...</p>
        </div>
      </section>
    );
  }

  // FIX 2: Added a fallback safeguard just in case techStack is ever undefined
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
    <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-12">
          Tech Stack
        </h2>

        <div className="space-y-12">
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                {category}
              </h3>
              {/* Horizontal scrolling carousel */}
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-max">
                  {items.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      {tech.image ? (
                        <div className="w-16 h-16 relative">
                          <Image
                            src={tech.image}
                            alt={tech.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 rounded flex items-center justify-center">
                          <span className="text-xs text-zinc-500">Icon</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-center">
                        {tech.name}
                      </span>
                      {tech.proficiency && (
                        <span className="text-xs text-zinc-500">
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
          <div className="text-center py-12">
            <p className="text-zinc-400">No tech stack items yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}