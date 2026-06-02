"use client";

import { FiMail, FiLinkedin, FiGithub, FiInstagram } from "react-icons/fi";

export default function FooterSection() {
  const handleEmail = () => {
    window.location.href = "mailto:kielesta.gc@gmail.com";
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="grid grid-cols-2 gap-12">
          {/* Left: Social Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <FiLinkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
               <FiGithub className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Right: Contact */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Get In Touch
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Interested in working together? Let&apos;s connect and discuss your next project.
            </p>
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-medium"
            >
              <FiMail className="w-5 h-5" />
              Send Email
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © 2025 Kiel Andrew Esta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}