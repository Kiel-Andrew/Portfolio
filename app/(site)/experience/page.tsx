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
  const rawExperiences = await prisma.experience.findMany();
  const experiences = [...rawExperiences].sort((a, b) => {
    const getSortDateVal = (exp: typeof a) => {
      if (exp.current || (exp.dateFormat === "RANGE" && !exp.endDate)) {
        return new Date(8640000000000000).getTime();
      }
      return exp.endDate ? new Date(exp.endDate).getTime() : new Date(exp.startDate).getTime();
    };
    const dateA = getSortDateVal(a);
    const dateB = getSortDateVal(b);
    if (dateB !== dateA) return dateB - dateA;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
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
                      {exp.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed pt-1">
                      {exp.description}
                    </p>
                    <p className="text-xs text-zinc-500 pt-1">
                      {exp.dateFormat === "SINGLE"
                        ? formatDate(exp.startDate)
                        : `${formatDate(exp.startDate)} — ${exp.current || !exp.endDate ? "Present" : formatDate(exp.endDate)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
