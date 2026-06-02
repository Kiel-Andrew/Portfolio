"use client";

import { Mail, ExternalLink } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left: Portrait & Info */}
          <div className="space-y-6">
            {/* Portrait Placeholder */}
            <div className="relative w-full max-w-sm mx-auto">
              <div className="aspect-square bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-zinc-400">
                  <p className="text-sm">Portrait Image</p>
                  <p className="text-xs">(Corporate attire, no background)</p>
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Kiel Andrew Esta
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                UI/UX Designer \ Developer
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button className="flex items-center gap-2 px-6 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <ExternalLink className="w-4 h-4" />
                Blog
              </button>
            </div>
          </div>

          {/* Right: About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              About
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              I specialize in crafting digital experiences where sleek design meets flawless functionality. My work combines thoughtful design principles with clean, scalable code to create solutions that not only look exceptional but also solve real user problems.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Whether designing interfaces or building full-stack applications, I focus on creating products that are both beautiful and intuitive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
