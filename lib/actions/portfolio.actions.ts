"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function uploadProjectCover(
  file: File
): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const fileName = `project-covers/${timestamp}-${file.name}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

export async function createProject(formData: {
  title: string;
  slug: string;
  description: string;
  content?: string;
  coverImageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  tags: string[];
}) {
  try {
    const project = await prisma.project.create({
      data: {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        coverImage: formData.coverImageUrl,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        featured: formData.featured,
        tags: formData.tags,
      },
    });
    return project;
  } catch (error) {
    console.error("Create project failed:", error);
    throw error;
  }
}

export async function updateProject(
  id: string,
  formData: Record<string, unknown>
) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: formData,
    });
    return project;
  } catch (error) {
    console.error("Update project failed:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Delete project failed:", error);
    throw error;
  }
}

export async function createExperience(formData: {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
}) {
  try {
    const experience = await prisma.experience.create({
      data: formData,
    });
    return experience;
  } catch (error) {
    console.error("Create experience failed:", error);
    throw error;
  }
}

export async function updateExperience(
  id: string,
  formData: Record<string, unknown>
) {
  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: formData,
    });
    return experience;
  } catch (error) {
    console.error("Update experience failed:", error);
    throw error;
  }
}

export async function deleteExperience(id: string) {
  try {
    await prisma.experience.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Delete experience failed:", error);
    throw error;
  }
}

export async function uploadCertificationBadge(
  file: File
): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const fileName = `badges/${timestamp}-${file.name}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("Badge upload failed:", error);
    return null;
  }
}

export async function createCertification(formData: {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  badgeImageUrl?: string;
}) {
  try {
    const certification = await prisma.certification.create({
      data: {
        name: formData.name,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        credentialId: formData.credentialId,
        credentialUrl: formData.credentialUrl,
        badgeImage: formData.badgeImageUrl,
      },
    });
    return certification;
  } catch (error) {
    console.error("Create certification failed:", error);
    throw error;
  }
}

export async function deleteCertification(id: string) {
  try {
    await prisma.certification.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Delete certification failed:", error);
    throw error;
  }
}

export async function uploadTechStackImage(
  file: File
): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const fileName = `tech-stack/${timestamp}-${file.name}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("Tech stack image upload failed:", error);
    return null;
  }
}

export async function createTechStack(formData: {
  name: string;
  category: string;
  imageUrl?: string;
}) {
  try {
    const tech = await prisma.techStack.create({
      data: {
        name: formData.name,
        category: formData.category,
        image: formData.imageUrl,
      },
    });
    return tech;
  } catch (error) {
    console.error("Create tech stack failed:", error);
    throw error;
  }
}

export async function updateTechStack(
  id: string,
  formData: {
    name?: string;
    category?: string;
    imageUrl?: string;
  }
) {
  try {
    const tech = await prisma.techStack.update({
      where: { id },
      data: {
        ...(formData.name && { name: formData.name }),
        ...(formData.category && { category: formData.category }),
        ...(formData.imageUrl && { image: formData.imageUrl }),
      },
    });
    return tech;
  } catch (error) {
    console.error("Update tech stack failed:", error);
    throw error;
  }
}

export async function deleteTechStack(id: string) {
  try {
    await prisma.techStack.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Delete tech stack failed:", error);
    throw error;
  }
}
