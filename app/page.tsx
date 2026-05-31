import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-950">
          Full-Stack Developer & UI Engineer
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-600">
          I build performant, accessible web applications with modern tooling.
          Passionate about clean code, thoughtful design, and shipping quickly.
        </p>
        <div className="flex gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 transition"
          >
            View Projects
          </Link>
          <Link
            href="/experience"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-950 border border-zinc-300 rounded-lg hover:border-zinc-400 transition"
          >
            Experience
          </Link>
        </div>
      </section>

      <section className="space-y-4 border-t border-zinc-200 pt-12">
        <h2 className="text-2xl font-semibold text-zinc-950">Featured Stack</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["React", "TypeScript", "Next.js", "Tailwind CSS"].map((tech) => (
            <div
              key={tech}
              className="px-4 py-3 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-lg bg-zinc-50"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
