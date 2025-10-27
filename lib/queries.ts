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
    // Return default profile data as fallback
    return {
      name: "Arif Rahim",
      tagline: "Software Engineer & DevOps Expert",
      bio: "Passionate software engineer with expertise in full-stack development and DevOps practices.",
      about:
        "I'm a dedicated software engineer with a passion for creating efficient, scalable solutions.",
      location: "Location",
      email: "contact@example.com",
      resumeURL: "",
      photo: { url: "", label: "Profile Photo", alt: "Arif Rahim" },
      socials: {},
      metrics: [
        { label: "Years Experience", value: "5+" },
        { label: "Projects Completed", value: "50+" },
        { label: "Technologies", value: "20+" },
        { label: "Happy Clients", value: "30+" },
      ],
      experience: [],
    };
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
  try {
    const response = await axios.get(
      `${BLOG_API_BASE_URL}?isFeatured=true&includeContent=true`,
    );
    console.log("Featured blogs API response:", response.data);
    console.log("Featured blogs posts:", response.data.posts);
    console.log("Featured blogs pagination:", response.data.pagination);

    return response.data.posts || [];
  } catch (error) {
    console.error("Failed to fetch featured blogs from API:", error);
    // Fallback to local data if API fails
    return blogsData.sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt || new Date()).getTime() -
        new Date(a.publishedAt || a.createdAt || new Date()).getTime(),
    );
  }
}

export async function getBlogDetail({
  slug,
}: {
  slug: string;
}): Promise<Blog | null> {
  return (
    blogsData.find((blog) => {
      const blogSlug =
        blog.slug ||
        blog.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      return blogSlug === slug;
    }) || null
  );
}

export async function getBlogSlugs(): Promise<string[]> {
  return blogsData
    .map(
      (blog) =>
        blog.slug ||
        blog.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
    )
    .filter((slug): slug is string => slug !== undefined);
}

// Blog API functions for dashboard
const BLOG_API_BASE_URL =
  process.env.NEXT_PUBLIC_BLOG_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://arif-sir-blog-backend.onrender.com/api/blog"
    : "http://localhost:8000/api/blog");

export async function fetchBlogsFromAPI(params: {
  page?: number;
  limit?: number;
  published?: boolean;
  search?: string;
  tag?: string;
  category?: string;
  isFeatured?: boolean;
}) {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.published !== undefined)
      searchParams.append("published", params.published.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.tag) searchParams.append("tag", params.tag);
    if (params.category) searchParams.append("category", params.category);
    if (params.isFeatured !== undefined)
      searchParams.append("isFeatured", params.isFeatured.toString());

    const response = await axios.get(`${BLOG_API_BASE_URL}?${searchParams}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blogs from API:", error);
    throw new Error("Failed to fetch blogs");
  }
}

export async function getBlogFromAPI(id: string) {
  try {
    const response = await axios.get(`${BLOG_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog from API:", error);
    throw new Error("Failed to fetch blog");
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const response = await axios.post(BLOG_API_BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create blog post:", error);
    throw new Error("Failed to create blog post");
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const response = await axios.put(`${BLOG_API_BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update blog post:", error);
    throw new Error("Failed to update blog post");
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const response = await axios.delete(`${BLOG_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    throw new Error("Failed to delete blog post");
  }
}

export async function getBlogTags() {
  try {
    const response = await axios.get(`${BLOG_API_BASE_URL}/tags/all`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog tags:", error);
    throw new Error("Failed to fetch blog tags");
  }
}

export async function getBlogCategories() {
  try {
    const response = await axios.get(`${BLOG_API_BASE_URL}/categories/all`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog categories:", error);
    throw new Error("Failed to fetch blog categories");
  }
}
