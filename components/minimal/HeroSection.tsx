"use client";

import Image from "next/image";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {/* 1. Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-4">
            {/* Avatar Profile Headshot */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md shrink-0">
              <Image
                src="/profile.jpg"
                alt="Kiel Andrew Esta"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Name and Details */}
            <div className="space-y-1">
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 sm:self-center shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-bold text-xs shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              Chat with Me
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs shadow-sm">
              <Mail className="w-3.5 h-3.5" />
              Send Email
            </button>
          </div>
        </div>

        {/* 2. Hero Content (Completely borderless and transparent without stroke boxes) */}
        <div className="mt-8">
          <div className="space-y-8">
            {/* Main Profile Text - Paraphrased One-Liner */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                About Me
              </h3>
              <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                I craft digital experiences where sleek design meets seamless functionality, ensuring every project follows refined design principles while precisely addressing client needs.
              </p>
            </div>

            {/* What I Do List */}
            <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                What I Do
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <li>
                  <strong className="font-bold text-zinc-800 dark:text-zinc-200">Design:</strong> I use Figma to create realistic models of websites and apps. This helps us see exactly how a product will look and feel before we start building it.
                </li>
                <li>
                  <strong className="font-bold text-zinc-800 dark:text-zinc-200">Development:</strong> I use HTML, CSS, and JavaScript to bring those designs to life. I write clean code to ensure every site is fast and reliable.
                </li>
                <li>
                  <strong className="font-bold text-zinc-800 dark:text-zinc-200">Responsive Layouts:</strong> I make sure your product looks great on every screen, from small smartphones to large desktop monitors.
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
