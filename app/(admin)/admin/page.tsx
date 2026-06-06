import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FolderGit, Briefcase, Award, Cpu, ArrowRight, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Kiel Andrew",
};

export default async function AdminDashboard() {
  const projectCount = await prisma.project.count();
  const experienceCount = await prisma.experience.count();
  const certCount = await prisma.certification.count();
  const techCount = await prisma.techStack.count();

  const sections = [
    {
      label: "Projects",
      count: projectCount,
      href: "/admin/projects",
      description: "Manage your portfolio projects, descriptions, tags, repository links, and cover images.",
      icon: FolderGit,
      actionLabel: "Manage Projects",
    },
    {
      label: "Experience",
      count: experienceCount,
      href: "/admin/experience",
      description: "Manage your professional career timeline, company profiles, dates, and technology tags.",
      icon: Briefcase,
      actionLabel: "Manage Experience",
    },
    {
      label: "Certifications",
      count: certCount,
      href: "/admin/certifications",
      description: "Manage verified credentials, licenses, issuers, dates, and credential badges.",
      icon: Award,
      actionLabel: "Manage Certifications",
    },
    {
      label: "Tech Stack",
      count: techCount,
      href: "/admin/tech-stack",
      description: "Manage your technical stack categories, logo icons, and tool categorizations.",
      icon: Cpu,
      actionLabel: "Manage Tech Stack",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal">
            Select a section below to update your live portfolio content
          </p>
        </div>
        
        {/* Back to public site button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-200 transition-colors font-bold text-xs rounded-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          View Public Site
        </Link>
      </div>

      {/* Main Grid Navigation */}
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="flex flex-col justify-between p-6 border border-zinc-800 bg-zinc-900/10 hover:border-zinc-700/60 hover:bg-zinc-900/20 transition-all group rounded-none"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-zinc-800 bg-zinc-950 text-zinc-400 group-hover:text-zinc-200 transition-colors rounded-none">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-zinc-100 tracking-tight">
                      {section.label}
                    </h2>
                  </div>
                  {/* Stats Count Badge */}
                  <span className="px-2.5 py-1 text-xs font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-none">
                    {section.count} Items
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  {section.description}
                </p>
              </div>

              {/* Action trigger */}
              <div className="flex items-center gap-1.5 pt-6 text-xs font-bold text-zinc-200 group-hover:text-zinc-100 transition-colors uppercase tracking-wider">
                <span>{section.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
