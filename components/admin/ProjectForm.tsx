"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Film, Image as ImageIcon, Trash2 } from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/actions/portfolio.actions";
import { supabase } from "@/lib/supabase";

interface ProjectFormProps {
  project?: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    images: string[];
    videos: string[];
    role?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    featured: boolean;
    tags: string[];
  };
}

interface GalleryItem {
  id: string;
  url: string;
  file?: File;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Core fields
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [role, setRole] = useState(project?.role || "");
  const [tagsInput, setTagsInput] = useState(project?.tags.join(", ") || "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [featured, setFeatured] = useState(project?.featured || false);

  // Cover Image
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(project?.coverImage || "");

  // Gallery Items (Combined URLs and new files)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    project?.images.map((url) => ({ id: url, url })) || []
  );

  // Gallery Videos
  const [existingVideos, setExistingVideos] = useState<string[]>(project?.videos || []);
  const [newVideoFiles, setNewVideoFiles] = useState<File[]>([]);

  // Drag and drop sorting state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // File handlers
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        url: URL.createObjectURL(file),
        file,
      }));
      setGalleryItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewVideoFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const removeExistingVideo = (url: string) => {
    setExistingVideos((prev) => prev.filter((vid) => vid !== url));
  };

  const removeNewVideo = (index: number) => {
    setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...galleryItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setGalleryItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  async function handleDelete() {
    if (!project) return;
    if (!confirm(`Are you sure you want to delete "${title}" project?`)) return;

    setLoading(true);
    try {
      await deleteProject(project.id);
      alert("Project deleted successfully!");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      alert("Error deleting project: " + String(error));
      setLoading(false);
    }
  }

  async function clientUploadProjectFile(
    file: File,
    folder: string
  ): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}-${file.name}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error(`Client upload to ${folder} failed:`, error);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let finalCoverUrl = coverPreview;

      // 1. Upload Cover Image if updated
      if (coverImageFile) {
        const url = await clientUploadProjectFile(coverImageFile, "project-covers");
        if (!url) throw new Error("Failed to upload cover image");
        finalCoverUrl = url;
      }

      // 2. Upload New Gallery Images and keep their specific sequence
      const finalImages: string[] = [];
      for (const item of galleryItems) {
        if (item.file) {
          const url = await clientUploadProjectFile(item.file, "project-images");
          if (!url) throw new Error(`Failed to upload image: ${item.file.name}`);
          finalImages.push(url);
        } else {
          finalImages.push(item.url);
        }
      }

      // 3. Upload New Videos
      const uploadedVideos: string[] = [];
      for (const file of newVideoFiles) {
        const url = await clientUploadProjectFile(file, "project-videos");
        if (!url) throw new Error(`Failed to upload video: ${file.name}`);
        uploadedVideos.push(url);
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const finalVideos = [...existingVideos, ...uploadedVideos];

      if (project) {
        // Edit mode
        await updateProject(project.id, {
          title: title.trim(),
          description: description.trim(),
          coverImage: finalCoverUrl,
          images: finalImages,
          videos: finalVideos,
          role: role.trim() || null,
          liveUrl: liveUrl.trim() || null,
          githubUrl: githubUrl.trim() || null,
          featured,
          tags,
        });
        alert("Project updated successfully!");
      } else {
        // Create mode
        await createProject({
          title: title.trim(),
          description: description.trim(),
          coverImageUrl: finalCoverUrl,
          images: finalImages,
          videos: finalVideos,
          role: role.trim() || undefined,
          liveUrl: liveUrl.trim() || undefined,
          githubUrl: githubUrl.trim() || undefined,
          featured,
          tags,
        });
        alert("Project created successfully!");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      alert("Error saving project: " + String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
          placeholder="e.g. Portfolio Website"
        />
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Role
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
          className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
          placeholder="e.g. Lead Designer / Frontend Developer"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={4}
          className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50 resize-y"
          placeholder="Short project description..."
        />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Tech Stack / Tags (comma separated)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          disabled={loading}
          className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
          placeholder="React, TypeScript, Next.js"
        />
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Cover Image *
        </label>
        {coverPreview && (
          <div className="relative w-48 aspect-video border border-zinc-800 bg-zinc-900/50 mb-2 overflow-hidden">
            <img src={coverPreview} alt="Cover Preview" className="object-cover w-full h-full" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          disabled={loading}
          className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:border file:border-zinc-800 file:bg-zinc-900 file:hover:bg-zinc-800 file:text-zinc-300 file:rounded-none file:font-bold file:uppercase file:tracking-wider file:cursor-pointer disabled:opacity-50"
        />
        <p className="text-[10px] text-zinc-500 italic font-medium">
          Recommended: Landscape (e.g. 16:9, 1920x1080px) or Portrait (e.g. 3:4, 1080x1350px) aspect ratio, max 5MB
        </p>
      </div>

      {/* Gallery Images Upload */}
      <div className="space-y-3 border-t border-zinc-900 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Gallery Images
        </label>
        
        {/* Previews */}
        {galleryItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative aspect-square border border-zinc-800 group overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                  draggedIndex === index ? "opacity-40 scale-95 border-dashed border-zinc-500" : "opacity-100"
                }`}
                title="Drag to change sequence"
              >
                <img
                  src={item.url}
                  alt={`Gallery preview ${index + 1}`}
                  className="object-cover w-full h-full pointer-events-none"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryItem(item.id)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
                {/* Drag sort badge */}
                <div className="absolute bottom-1 left-1 bg-black/60 px-1 py-0.5 text-[8px] text-zinc-400 uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Drag to sort
                </div>
              </div>
            ))}
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={loading}
          className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:border file:border-zinc-800 file:bg-zinc-900 file:hover:bg-zinc-800 file:text-zinc-300 file:rounded-none file:font-bold file:uppercase file:tracking-wider file:cursor-pointer disabled:opacity-50"
        />
        <p className="text-[10px] text-zinc-500 italic font-medium">
          Recommended: Portrait (e.g. 3:4/4:5, 1080x1350px) or Landscape (e.g. 16:9, 1920x1080px) aspect ratio
        </p>
      </div>

      {/* Gallery Videos Upload */}
      <div className="space-y-3 border-t border-zinc-900 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Gallery Videos
        </label>
        
        {/* Previews / File lists */}
        {(existingVideos.length > 0 || newVideoFiles.length > 0) && (
          <div className="space-y-2 mb-2">
            {/* Existing Videos */}
            {existingVideos.map((url, i) => (
              <div key={`existing-vid-${i}`} className="flex items-center justify-between p-2 border border-zinc-800 bg-zinc-900/30 text-xs">
                <div className="flex items-center gap-2 text-zinc-300 truncate">
                  <Film className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                  <span className="truncate">{url.split("/").pop()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingVideo(url)}
                  className="text-red-400 hover:text-red-350 p-1 font-bold"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* New Videos */}
            {newVideoFiles.map((file, i) => (
              <div key={`new-vid-${i}`} className="flex items-center justify-between p-2 border border-zinc-800 bg-zinc-900/30 text-xs">
                <div className="flex items-center gap-2 text-zinc-300 truncate">
                  <Film className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                  <span className="truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeNewVideo(i)}
                  className="text-zinc-400 hover:text-zinc-300 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoChange}
          disabled={loading}
          className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:border file:border-zinc-800 file:bg-zinc-900 file:hover:bg-zinc-800 file:text-zinc-300 file:rounded-none file:font-bold file:uppercase file:tracking-wider file:cursor-pointer disabled:opacity-50"
        />
        <p className="text-[10px] text-zinc-500 italic font-medium">
          Recommended: MP4, WebM format (max 50MB)
        </p>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Live URL
          </label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            GitHub URL
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
            placeholder="https://github.com/username/project"
          />
        </div>
      </div>

      {/* Featured checkbox */}
      <label className="flex items-center gap-2 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          disabled={loading}
          className="accent-zinc-100"
        />
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Featured Project
        </span>
      </label>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-zinc-900 mt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          disabled={loading}
          className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-bold text-xs rounded-none transition-colors disabled:opacity-50 text-center"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-none transition-colors disabled:opacity-50 shadow-sm text-center"
        >
          {loading ? "Saving..." : project ? "Save Changes" : "Create Project"}
        </button>

        {project && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 border border-zinc-800 hover:border-red-900 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 font-bold text-xs rounded-none transition-colors disabled:opacity-50 text-center"
          >
            Delete Project
          </button>
        )}
      </div>
    </form>
  );
}
