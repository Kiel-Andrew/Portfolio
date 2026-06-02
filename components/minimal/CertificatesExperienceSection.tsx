"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

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
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(dateString));
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
      <section className="py-16">
        <p className="text-zinc-400">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="grid grid-cols-3 gap-12">
          {/* Left: Certificates (30%) */}
          <div className="col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Certifications
            </h2>
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <p className="text-sm text-zinc-400">No certifications yet.</p>
              ) : (
                certificates.map((cert) => (
                  <div key={cert.id} className="space-y-1 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(cert.issueDate)}
                    </p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Experience (70%) */}
          <div className="col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Experience
            </h2>
            <div className="space-y-6">
              {experiences.length === 0 ? (
                <p className="text-sm text-zinc-400">No experience added yet.</p>
              ) : (
                experiences.map((exp) => (
                  <div key={exp.id} className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                        {exp.current ? "Current" : "Past"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      {formatDate(exp.startDate)} —{" "}
                      {exp.endDate ? formatDate(exp.endDate) : "Present"}
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-3 leading-relaxed">
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
