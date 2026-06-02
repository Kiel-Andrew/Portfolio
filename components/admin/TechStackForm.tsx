"use client";

import { useState } from "react";
import {
  createTechStack,
  uploadTechStackImage,
} from "@/lib/actions/portfolio.actions";

const categories = ["Frontend", "Backend", "DevOps", "Design", "Other"];

export default function TechStackForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [iconName, setIconName] = useState("");
  const [proficiency, setProficiency] = useState<number>(50);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const url = await uploadTechStackImage(image);
        if (!url) throw new Error("Failed to upload image");
        imageUrl = url;
      }

      await createTechStack({
        name,
        category,
        iconName,
        imageUrl,
        proficiency,
      });

      alert("Tech stack added successfully!");
      setName("");
      setIconName("");
      setProficiency(50);
      setImage(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add tech stack");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-200">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-2 w-full rounded-lg bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., React, TypeScript"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-200">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-lg bg-zinc-800 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">
            Proficiency (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={proficiency}
            onChange={(e) => setProficiency(Number(e.target.value))}
            className="mt-2 w-full rounded-lg bg-zinc-800 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">
          Lucide Icon Name
        </label>
        <input
          type="text"
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          className="mt-2 w-full rounded-lg bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Code, Database, Palette"
        />
        <p className="mt-1 text-xs text-zinc-400">
          Find icons at lucide.dev
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">
          Icon Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mt-2 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Tech Stack"}
      </button>
    </form>
  );
}
