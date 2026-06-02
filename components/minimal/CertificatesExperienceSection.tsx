"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Briefcase, Award } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
}

export default function CertificatesExperienceSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/certificates").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/experiences").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([certs, exps]) => {
        setCertificates(Array.isArray(certs) ? certs : []);
        setExperiences(Array.isArray(exps) ? exps : []);
      })
      .catch((error) => {
        console.error("Failed to fetch:", error);
        setCertificates([]);
        setExperiences([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <p className="text-xs text-zinc-400">Loading experience & certifications...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Certifications (col-span-1) - borderless and flat */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wider">
              <Award className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              Certifications
            </h2>
            
            <div className="space-y-4 divide-y divide-zinc-100 dark:divide-zinc-900">
              {certificates.length === 0 ? (
                <p className="text-xs text-zinc-400">No certifications yet.</p>
              ) : (
                certificates.map((cert, index) => (
                  <div key={cert.id} className={`${index > 0 ? "pt-4" : ""} space-y-1`}>
                    <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {cert.name}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">
                      {cert.issuer}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-zinc-400">
                        {formatDate(cert.issueDate)}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[10px] text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:underline font-bold"
                        >
                          View <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Experience (col-span-2) - borderless and flat */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              Experience
            </h2>
            
            <div className="space-y-6 divide-y divide-zinc-100 dark:divide-zinc-900">
              {experiences.length === 0 ? (
                <p className="text-xs text-zinc-400">No experience added yet.</p>
              ) : (
                experiences.map((exp, index) => (
                  <div key={exp.id} className={`${index > 0 ? "pt-5" : ""} space-y-1.5`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                          {exp.role}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-bold rounded-full">
                        {exp.current ? "Current" : "Past"}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                      {exp.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
