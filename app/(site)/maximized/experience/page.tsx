import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export default async function MaximizedExperience() {
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
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-zinc-100">Experience</h1>
        <p className="text-xl text-zinc-400">
          A timeline of my professional growth.
        </p>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-none border border-zinc-700 bg-zinc-800/40 p-12 text-center">
          <p className="text-zinc-400">No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-none border border-zinc-700 bg-zinc-800/40 p-8 hover:border-zinc-600 transition space-y-4"
            >
              <h3 className="text-xl font-semibold text-zinc-100">
                {exp.title}
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {exp.description}
              </p>
              <div className="text-sm text-zinc-500">
                {exp.dateFormat === "SINGLE"
                  ? formatDate(exp.startDate)
                  : `${formatDate(exp.startDate)} — ${exp.current || !exp.endDate ? "Present" : formatDate(exp.endDate)}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
