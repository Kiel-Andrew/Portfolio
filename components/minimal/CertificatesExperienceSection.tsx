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
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  dateFormat?: string;
  description: string;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    // Check if it is Jan 1st UTC (often used for year-only inputs)
    const isJanFirst = date.getUTCMonth() === 0 && date.getUTCDate() === 1;
    if (isJanFirst) {
      return date.getUTCFullYear().toString();
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      timeZone: "UTC"
    }).format(date);
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
    <section className="py-2 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
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
                [...experiences]
                  .sort((a, b) => {
                    const getSortDateVal = (exp: Experience) => {
                      if (exp.current || (exp.dateFormat === "RANGE" && !exp.endDate)) {
                        return new Date(8640000000000000).getTime();
                      }
                      return exp.endDate ? new Date(exp.endDate).getTime() : new Date(exp.startDate).getTime();
                    };
                    const dateA = getSortDateVal(a);
                    const dateB = getSortDateVal(b);
                    if (dateB !== dateA) return dateB - dateA;
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                  })
                  .map((exp, index) => (
                    <div key={exp.id} className={`${index > 0 ? "pt-5" : ""} space-y-1.5`}>
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                        {exp.description}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {exp.dateFormat === "SINGLE"
                          ? formatDate(exp.startDate)
                          : `${formatDate(exp.startDate)} — ${exp.current || !exp.endDate ? "Present" : formatDate(exp.endDate)}`}
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
