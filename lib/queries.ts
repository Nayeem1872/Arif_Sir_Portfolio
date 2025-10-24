import { blogsData } from "@/data/blogs";
import { projectsData } from "@/data/projects";
import { servicesData } from "@/data/services";
import { technologiesData } from "@/data/technologies";
import type { Blog, Profile, Project, Service, Technology } from "@/types/data";
import axios from "axios";
import { config } from "./config";

export async function getProfile(): Promise<Profile> {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/profile`);
    return response.data.data; // Extract data from the API response structure
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw new Error("Failed to fetch profile data");
  }
}

export async function updateProfile(
  profileData: Partial<Profile>,
): Promise<Profile> {
  try {
    const response = await axios.put(
      `${config.apiBaseUrl}/profile`,
      profileData,
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile data");
  }
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

export async function getBlogs(): Promise<Blog[]> {
  return blogsData.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getBlogDetail({
  slug,
}: {
  slug: string;
}): Promise<Blog | null> {
  return blogsData.find((blog) => blog.slug === slug) || null;
}

export async function getBlogSlugs(): Promise<string[]> {
  return blogsData.map((blog) => blog.slug);
}
