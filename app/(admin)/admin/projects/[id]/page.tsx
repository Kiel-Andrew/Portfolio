import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Project | Admin",
};

interface EditProjectProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-100">Edit Project</h1>
          <p className="text-zinc-400">Modify project details, gallery, and videos</p>
        </div>
      </div>

      <ProjectForm project={project} />
    </div>
  );
}
