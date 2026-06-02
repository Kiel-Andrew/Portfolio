"use client";

import Image from "next/image";
import { Mail, MessageSquare, MapPin, Moon, Sun, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ViewToggle from "@/components/layout/ViewToggle";

export default function HeroSection() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme ?? theme ?? "light";
  const isDark = currentTheme === "dark";

  return (
    <section className="relative pt-16 pb-2 overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300 animate-in fade-in duration-500">
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        {/* 30/70 Ratio Flex Grid */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Column (30%): Sharp Rectangular Portrait Image */}
          <div className="relative z-10 w-full md:w-[30%] shrink-0">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Kiel Andrew Esta"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column (70%): Details, Bio, Control Switches & Contacts */}
          <div className="relative z-10 w-full md:w-[70%] space-y-6">
            
            {/* Header Details + Switches Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Kiel Andrew Esta
                </h1>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Tanza, Cavite</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  UI/UX Designer \ Frontend Developer
                </p>
              </div>

              {/* Control Switch Buttons */}
              <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                <ViewToggle />

                {/* Dark/Light mode toggle switch - completely sharp/no round */}
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-none border-2 border-transparent bg-zinc-200 dark:bg-zinc-800 transition-colors duration-200 ease-in-out focus:outline-none"
                  aria-label="Toggle theme"
                >
                  <span
                    className={`${
                      isDark ? "translate-x-6 bg-zinc-950" : "translate-x-0 bg-white"
                    } pointer-events-none flex h-7 w-7 transform items-center justify-center rounded-none shadow-lg ring-0 transition duration-200 ease-in-out`}
                  >
                    {!mounted ? (
                      <div className="w-4 h-4" />
                    ) : isDark ? (
                      <Moon className="w-4 h-4 text-zinc-100 fill-zinc-100" />
                    ) : (
                      <Sun className="w-4 h-4 text-zinc-900 fill-zinc-900" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* One-liner Biography - Exactly matching requested theme */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                My work focuses on the combination of sleek design and functionality. The projects I make not only follow the principles of design, but also meet the needs of my clients.
              </p>
            </div>

            {/* Action Buttons - completely sharp/no round */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-bold text-xs shadow-sm">
                <MessageSquare className="w-3.5 h-3.5" />
                Chat with Me
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs shadow-sm">
                <Mail className="w-3.5 h-3.5" />
                Send Email
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
                Blog
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
