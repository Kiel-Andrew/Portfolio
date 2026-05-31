import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function MaximizedExperience() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-zinc-100">Experience</h1>
        <p className="text-xl text-zinc-400">
          A timeline of my professional growth.
        </p>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-12 text-center">
          <p className="text-zinc-400">No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-8 hover:border-zinc-600 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold text-zinc-100">
                    {exp.role}
                  </h3>
                  <p className="text-sm font-medium text-zinc-400">
                    {exp.company}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                <div className="text-sm text-zinc-500 whitespace-nowrap">
                  {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate!)}
                </div>
              </div>

              <p className="mt-4 text-zinc-300 leading-relaxed">
                {exp.description}
              </p>

              {exp.skillsUsed.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.skillsUsed.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium text-zinc-300 bg-zinc-700/50 px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
