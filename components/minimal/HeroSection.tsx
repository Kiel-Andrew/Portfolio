"use client";

import { Mail, ExternalLink } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-8 sm:py-12 overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Premium background decorative shapes */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-zinc-100/50 to-zinc-200/30 dark:from-zinc-900/10 dark:to-zinc-800/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          
          {/* Left Block: Info Content (Name, Title, Bio, Buttons) */}
          <div className="relative z-20 flex-1 space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Kiel Andrew Esta
              </h1>
              <p className="text-md sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
                UI/UX Designer & Full-Stack Developer
              </p>
            </div>

            {/* Bio - flowed seamlessly without the "About" heading, smaller text sizes */}
            <div className="space-y-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              <p>
                I specialize in crafting digital experiences where sleek design meets flawless functionality. My work combines thoughtful design principles with clean, scalable code to create solutions that not only look exceptional but also solve real user problems.
              </p>
              <p>
                Whether designing interfaces or building full-stack applications, I focus on creating products that are beautiful and intuitive.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-bold text-sm shadow-md">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors font-bold text-sm">
                <ExternalLink className="w-4 h-4" />
                Blog
              </button>
            </div>
          </div>

          {/* Right Block: Overlapping Portrait Card (Image with lower z-index depth) */}
          <div className="relative z-10 flex-1 w-full max-w-sm lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 aspect-square">
              {/* Overlapping shadow background */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800/50 rounded-2xl -z-10 blur-sm transform -rotate-3" />
              
              {/* Main portrait container */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 rounded-xl flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/80 shadow-xl overflow-hidden">
                <div className="text-center p-6 text-zinc-500 dark:text-zinc-400">
                  <p className="text-md font-bold">Portrait Image</p>
                  <p className="text-xs mt-1 opacity-75">(Corporate attire, no background)</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
