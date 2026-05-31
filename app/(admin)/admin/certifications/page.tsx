import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Certifications | Admin",
};

export default async function AdminCertifications() {
  const certifications = await prisma.certification.findMany({
    orderBy: { issueDate: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-100">Certifications</h1>
          <p className="text-zinc-400">Manage your certifications & badges</p>
        </div>
        <Link
          href="/admin/certifications/create"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-zinc-700 rounded-lg hover:bg-zinc-600 transition"
        >
          Add Certification
        </Link>
      </div>

      {certifications.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-12 text-center">
          <p className="text-zinc-400">No certifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/40 p-4 hover:bg-zinc-800/60 transition"
            >
              <div className="flex-1">
                <h3 className="font-medium text-zinc-100">{cert.name}</h3>
                <p className="text-sm text-zinc-500">{cert.issuer}</p>
              </div>
              <a
                href={`/admin/certifications/${cert.id}`}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
              >
                Edit
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
