import TechStackForm from "@/components/admin/TechStackForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Technology | Admin",
};

export default function CreateTechStackPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-100">Add Technology</h1>
        <p className="text-zinc-400">Add a new technology to your tech stack</p>
      </div>
      <div className="max-w-2xl">
        <TechStackForm />
      </div>
    </div>
  );
}
