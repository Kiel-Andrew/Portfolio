import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Project | Admin",
};

export default function CreateProjectPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-100">Create Project</h1>
        <p className="text-zinc-400">Add a new project to your portfolio</p>
      </div>
      <ProjectForm />
    </div>
  );
}
