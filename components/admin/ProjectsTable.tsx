"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { reorderProjects } from "@/lib/actions/portfolio.actions";

interface Project {
  id: string;
  title: string;
  coverImage: string;
  role?: string | null;
  featured: boolean;
  tags: string[];
}

interface ProjectsTableProps {
  projects: Project[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync prop changes (e.g. after edit/delete/create)
  const [prevProjects, setPrevProjects] = useState(projects);
  if (projects !== prevProjects) {
    setProjectList(projects);
    setPrevProjects(projects);
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newList = [...projectList];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setProjectList(newList);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    setSaving(true);
    try {
      const ids = projectList.map((p) => p.id);
      await reorderProjects(ids);
      router.refresh();
    } catch (error) {
      alert("Failed to save new project order: " + String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full overflow-x-auto border border-zinc-850 bg-zinc-900/10 relative">
      {saving && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10 animate-in fade-in duration-150">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 bg-zinc-950 px-3 py-1.5 border border-zinc-800">
            Saving sequence...
          </span>
        </div>
      )}
      <table className="w-full text-left border-collapse text-xs select-none">
        <thead>
          <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 uppercase font-bold tracking-wider">
            <th className="p-4 w-12 text-center"></th>
            <th className="p-4 w-20">Cover</th>
            <th className="p-4">Title</th>
            <th className="p-4">Role</th>
            <th className="p-4">Tech Stack</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {projectList.map((project, index) => (
            <tr
              key={project.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`hover:bg-zinc-900/20 transition-colors align-middle ${
                draggedIndex === index ? "opacity-30 bg-zinc-950/50 border-dashed" : ""
              }`}
            >
              <td className="p-4 text-center cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors">
                <GripVertical className="w-4 h-4 mx-auto" />
              </td>
              <td className="p-4">
                {project.coverImage ? (
                  <div className="w-12 aspect-video bg-zinc-900 border border-zinc-800 overflow-hidden relative">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-12 aspect-video bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-600 font-bold uppercase">
                    None
                  </div>
                )}
              </td>
              <td className="p-4 font-bold text-zinc-200">
                <div className="flex items-center gap-2">
                  <span>{project.title}</span>
                  {project.featured && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 border border-yellow-500/20">
                      Featured
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4 text-zinc-400">
                {project.role || <span className="text-zinc-600 font-normal italic">Not specified</span>}
              </td>
              <td className="p-4 text-zinc-400 max-w-xs truncate">
                {project.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[9px] text-zinc-600 font-bold self-center">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-zinc-600 italic">None</span>
                )}
              </td>
              <td className="p-4 text-right">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="inline-flex items-center px-3 py-1 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-[10px] uppercase font-bold tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors rounded-none"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
