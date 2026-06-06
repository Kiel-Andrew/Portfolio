"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  createTechStack,
  updateTechStack,
  deleteTechStack,
  uploadTechStackImage,
} from "@/lib/actions/portfolio.actions";

interface TechStackItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
  image: string | null;
  proficiency: number | null;
}

interface TechStackManagerProps {
  initialTechStack: TechStackItem[];
}

const categories = ["Frontend", "Backend", "DevOps", "Design", "Other"];

export default function TechStackManager({ initialTechStack }: TechStackManagerProps) {
  const [techStack, setTechStack] = useState<TechStackItem[]>(initialTechStack);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Group by category
  const groupedByCategory = techStack.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, TechStackItem[]>
  );

  function openAddModal() {
    setEditId(null);
    setName("");
    setCategory("Frontend");
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  }

  function openEditModal(tech: TechStackItem) {
    setEditId(tech.id);
    setName(tech.name);
    setCategory(tech.category);
    setImageFile(null);
    setImagePreview(tech.image);
    setIsModalOpen(true);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteTechStack(id);
      setTechStack((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting tech stack:", error);
      alert("Failed to delete technology");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      let imageUrl = editId ? (imagePreview || "") : "";

      if (imageFile) {
        const url = await uploadTechStackImage(imageFile);
        if (!url) throw new Error("Failed to upload image");
        imageUrl = url;
      }

      const defaultIconName = name.toLowerCase().replace(/\s+/g, "-");

      if (editId) {
        // Edit Mode
        const updated = await updateTechStack(editId, {
          name,
          category,
          iconName: defaultIconName,
          imageUrl,
        });

        setTechStack((prev) =>
          prev.map((item) =>
            item.id === editId
              ? {
                  ...item,
                  name: updated.name,
                  category: updated.category,
                  iconName: updated.iconName,
                  image: updated.image,
                }
              : item
          )
        );
      } else {
        // Add Mode
        const created = await createTechStack({
          name,
          category,
          iconName: defaultIconName,
          imageUrl,
          proficiency: undefined,
        });

        setTechStack((prev) => [...prev, created]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving tech stack:", error);
      alert("Failed to save tech stack");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Back Link & Header */}
      <div className="space-y-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Tech Stack
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Manage your technical skill categories, naming, and logos
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-none transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Technology
          </button>
        </div>
      </div>

      {/* Tech Stack List grouped by category */}
      {techStack.length === 0 ? (
        <div className="rounded-none border border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-xs text-zinc-500">No technologies added yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const items = groupedByCategory[cat] || [];
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-1.5">
                  {cat}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center justify-between border border-zinc-800 bg-zinc-900/20 p-4 rounded-none hover:border-zinc-700/60 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {tech.image ? (
                          <div className="relative w-8 h-8 shrink-0 bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                            <Image
                              src={tech.image}
                              alt={tech.name}
                              fill
                              sizes="32px"
                              className="object-contain p-1.5 grayscale"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 shrink-0 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-zinc-600">Icon</span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-zinc-100">
                            {tech.name}
                          </h3>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
                            {tech.category}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(tech)}
                          className="p-1.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors rounded-none"
                          aria-label="Edit technology"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tech.id, tech.name)}
                          className="p-1.5 border border-zinc-800 hover:border-red-900 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 transition-colors rounded-none"
                          aria-label="Delete technology"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pop-up Modal Frame */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 shadow-2xl rounded-none text-zinc-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  {editId ? "Edit Technology" : "Add New Technology"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Technology Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
                    placeholder="e.g. Next.js, Docker, Figma"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload for Logo */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Icon Image Logo
                  </label>
                  
                  {/* Preview & Drag-Drop style box */}
                  <div className="border border-dashed border-zinc-800 bg-zinc-900/10 p-4 flex flex-col items-center justify-center gap-3 rounded-none relative group hover:border-zinc-700/60 transition-colors">
                    {imagePreview ? (
                      <div className="relative w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          sizes="64px"
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <Upload className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    )}
                    
                    <div className="text-center">
                      <span className="text-xs text-zinc-400 font-medium cursor-pointer hover:underline">
                        Upload Image File
                      </span>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        SVG, PNG, or JPG (will be converted to black/white)
                      </p>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-zinc-900 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-bold text-xs rounded-none transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="flex-1 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-none transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {loading ? "Saving..." : editId ? "Save Changes" : "Create Tech"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
