import { profileData } from "@/data/profile";
import { projectsData } from "@/data/projects";
import { servicesData } from "@/data/services";
import { technologiesData } from "@/data/technologies";
import type { Profile, Project, Service, Technology } from "@/types/data";

export async function getProfile(): Promise<Profile> {
  return profileData;
}

export async function getProjects(): Promise<Project[]> {
  return projectsData;
}

export async function getServices(): Promise<Service[]> {
  return servicesData;
}

export async function getTech(): Promise<Technology[]> {
  return technologiesData;
}

export async function getProjectDetail({
  slug,
}: {
  slug: string;
}): Promise<Project | null> {
  return projectsData.find((project) => project.slug === slug) || null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return projectsData.map((project) => project.slug);
}
