"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/actions/portfolio.actions";

interface ExperienceItem {
  id: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string | null;
  current: boolean;
  dateFormat: string;
  description: string;
}

interface ExperienceManagerProps {
  initialExperiences: ExperienceItem[];
}

function parseDateInput(input: string): Date {
  const trimmed = input.trim();
  if (/^\d{4}$/.test(trimmed)) {
    // Just the year, parse to Jan 1st UTC of that year
    return new Date(Date.UTC(parseInt(trimmed, 10), 0, 1));
  }
  const date = new Date(trimmed);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: "${input}". Please use YYYY or YYYY-MM-DD.`);
  }
  return date;
}

function formatDisplayDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  const isJanFirst = date.getUTCMonth() === 0 && date.getUTCDate() === 1;
  if (isJanFirst) {
    return date.getUTCFullYear().toString();
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(date);
}

function getEditDateString(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  const isJanFirst = date.getUTCMonth() === 0 && date.getUTCDate() === 1;
  if (isJanFirst) {
    return date.getUTCFullYear().toString();
  }
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}-${day}`;
}

export default function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [dateFormat, setDateFormat] = useState<"RANGE" | "SINGLE">("RANGE");
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [description, setDescription] = useState("");

  function openAddModal() {
    setEditId(null);
    setTitle("");
    setDateFormat("RANGE");
    setStartDateStr("");
    setEndDateStr("");
    setDescription("");
    setIsModalOpen(true);
  }

  function openEditModal(exp: ExperienceItem) {
    setEditId(exp.id);
    setTitle(exp.title);
    setDateFormat((exp.dateFormat as "RANGE" | "SINGLE") || "RANGE");
    setStartDateStr(getEditDateString(exp.startDate));
    setEndDateStr(exp.endDate ? getEditDateString(exp.endDate) : "");
    setDescription(exp.description);
    setIsModalOpen(true);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}" experience?`)) return;

    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience entry");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDateStr.trim() || !description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const parsedStartDate = parseDateInput(startDateStr);
      const isRange = dateFormat === "RANGE";
      
      let parsedEndDate: Date | null = null;
      let currentVal = false;
      
      if (isRange) {
        if (endDateStr.trim()) {
          parsedEndDate = parseDateInput(endDateStr);
          currentVal = false;
        } else {
          parsedEndDate = null;
          currentVal = true;
        }
      } else {
        parsedEndDate = null;
        currentVal = false;
      }

      const payload = {
        title: title.trim(),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        current: currentVal,
        dateFormat,
        description: description.trim(),
      };

      if (editId) {
        // Edit Mode
        const updated = await updateExperience(editId, payload as any);
        setExperiences((prev) =>
          prev.map((item) => (item.id === editId ? (updated as any) : item))
        );
      } else {
        // Add Mode
        const created = await createExperience(payload as any);
        setExperiences((prev) => [...prev, created as any]);
      }

      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving experience:", error);
      alert(error.message || "Failed to save experience entry");
    } finally {
      setLoading(false);
    }
  }

  // Sort experiences descending by end date, then start date descending
  const sortedExperiences = [...experiences].sort((a, b) => {
    const getSortDateVal = (exp: ExperienceItem) => {
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
              Experience
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Manage your professional titles, timeline, and descriptions
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-none transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Experience
          </button>
        </div>
      </div>

      {/* Experience List */}
      {sortedExperiences.length === 0 ? (
        <div className="rounded-none border border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-xs text-zinc-500">No experience entries added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedExperiences.map((exp) => (
            <div
              key={exp.id}
              className="flex items-start justify-between border border-zinc-800 bg-zinc-900/20 p-4 rounded-none hover:border-zinc-700/60 transition-colors group gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-1 p-2 bg-zinc-900 border border-zinc-800 text-zinc-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100 truncate">
                    {exp.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {exp.dateFormat === "SINGLE"
                      ? formatDisplayDate(exp.startDate)
                      : `${formatDisplayDate(exp.startDate)} — ${exp.current ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEditModal(exp)}
                  className="p-1.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors rounded-none"
                  aria-label="Edit experience"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id, exp.title)}
                  className="p-1.5 border border-zinc-800 hover:border-red-900 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 transition-colors rounded-none"
                  aria-label="Delete experience"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline Modal Frame */}
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
              className="relative z-10 w-full max-w-lg border border-zinc-800 bg-zinc-950 p-6 shadow-2xl rounded-none text-zinc-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  {editId ? "Edit Experience" : "Add New Experience"}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
                    placeholder="e.g. Lead Full-Stack Developer at Google"
                  />
                </div>

                {/* Date Format Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Date Format *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="dateFormat"
                        value="RANGE"
                        checked={dateFormat === "RANGE"}
                        onChange={() => setDateFormat("RANGE")}
                        disabled={loading}
                        className="accent-zinc-100"
                      />
                      From and To (Range)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="dateFormat"
                        value="SINGLE"
                        checked={dateFormat === "SINGLE"}
                        onChange={() => setDateFormat("SINGLE")}
                        disabled={loading}
                        className="accent-zinc-100"
                      />
                      Just a Single Year
                    </label>
                  </div>
                </div>

                {/* Dates Input */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {dateFormat === "SINGLE" ? "Year *" : "Date From (Start Date) *"}
                    </label>
                    <input
                      type="text"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
                      placeholder={dateFormat === "SINGLE" ? "e.g. 2026" : "e.g. 2024 or 2024-05-01"}
                    />
                  </div>

                  {/* End Date (Only show if RANGE) */}
                  {dateFormat === "RANGE" && (
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Date To (Leave blank for "Present")
                      </label>
                      <input
                        type="text"
                        value={endDateStr}
                        onChange={(e) => setEndDateStr(e.target.value)}
                        disabled={loading}
                        className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
                        placeholder="e.g. 2026 or leave empty"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={loading}
                    rows={5}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50 resize-y"
                    placeholder="Describe your achievements, responsibilities, and technologies used..."
                  />
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
                    disabled={loading || !title.trim() || !startDateStr.trim() || !description.trim()}
                    className="flex-1 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-none transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {loading ? "Saving..." : editId ? "Save Changes" : "Create Experience"}
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
