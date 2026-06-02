"use client";

import { FiMail, FiLinkedin, FiGithub, FiInstagram } from "react-icons/fi";

export default function FooterSection() {
  const handleEmail = () => {
    window.location.href = "mailto:kielesta.gc@gmail.com";
  };

  return (
    <footer className="py-2 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Social Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Connect
            </h3>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs shadow-sm"
              >
                <FiLinkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs shadow-sm"
              >
                <FiGithub className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs shadow-sm"
              >
                <FiInstagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Right: Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Get In Touch
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Interested in working together? Let&apos;s connect and discuss your next project.
            </p>
            <button
              onClick={handleEmail}
              className="flex w-full items-center justify-center gap-1.5 px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-bold text-xs shadow-sm"
            >
              <FiMail className="w-3.5 h-3.5" />
              Send Email
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-none mt-12 pt-6">
          <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500">
            © 2026 Kiel Andrew Esta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}