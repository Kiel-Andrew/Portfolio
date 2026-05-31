"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProject,
  uploadProjectCover,
} from "@/lib/actions/portfolio.actions";

export default function ProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageUrl = "";

      if (coverImage) {
        const url = await uploadProjectCover(coverImage);
        if (!url) throw new Error("Failed to upload cover image");
        coverImageUrl = url;
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createProject({
        title,
        slug,
        description,
        coverImageUrl,
        liveUrl: liveUrl || undefined,
        githubUrl: githubUrl || undefined,
        featured,
        tags,
      });

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      alert("Error creating project: " + String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="Project title"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="project-slug"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="Project description"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="React, TypeScript, Next.js"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-800 file:text-zinc-100 hover:file:bg-zinc-700"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Live URL
        </label>
        <input
          type="url"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          GitHub URL
        </label>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="https://github.com/..."
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100"
        />
        <span className="text-sm font-medium text-zinc-300">
          Featured Project
        </span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-zinc-700 rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
        <a
          href="/admin/projects"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
