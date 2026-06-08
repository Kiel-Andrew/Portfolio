import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Experience | Kiel Andrew",
};

function formatDate(date: Date): string {
  const isJanFirst = date.getUTCMonth() === 0 && date.getUTCDate() === 1;
  if (isJanFirst) {
    return date.getUTCFullYear().toString();
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
          Experience
        </h1>
        <p className="text-lg text-zinc-600">
          A timeline of my professional journey.
        </p>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center">
          <p className="text-zinc-500">No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {index !== experiences.length - 1 && (
                <div className="absolute left-4 top-12 h-8 w-0.5 bg-zinc-200" />
              )}
              <div className="flex gap-6">
                <div className="relative pt-1">
                  <div className="h-8 w-8 rounded-full border-2 border-zinc-950 bg-white" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-zinc-950">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-medium text-zinc-600">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(exp.startDate)} —{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate!)}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.skillsUsed.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.skillsUsed.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
