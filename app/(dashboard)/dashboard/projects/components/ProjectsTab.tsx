"use client";

import { config } from "@/lib/config";
import { IconPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import ProjectModal from "./ProjectModal";
import ProjectsTable from "./ProjectsTable";

interface ProjectCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: ProjectCategory;
  images: string[];
  thumbnailImage: string;
  technologies: string[];
  features: string[];
  liveUrl?: string;
  sourceCodeUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (showOnlyFeatured) {
        params.append("featured", "true");
      }

      const response = await fetch(
        `${config.apiBaseUrl}/projects/admin?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, showOnlyFeatured]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/project-categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, [fetchProjects]);

  const handleAddProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        fetchProjects();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingProject(null);
    fetchProjects();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-fg text-lg font-semibold sm:text-xl">Projects</h2>
          <p className="text-text-muted text-sm">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={handleAddProject}
          className="bg-primary hover:bg-primary-dark text-bg flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors sm:w-auto"
        >
          <IconPlus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyFeatured}
                onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                className="text-primary focus:ring-primary/50 rounded border-gray-300"
              />
              <span className="text-fg text-sm">Featured only</span>
            </label>
          </div>
        </div>
      </div>

      <ProjectsTable
        projects={projects}
        loading={loading}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onTogglePublished={togglePublished}
        onToggleFeatured={toggleFeatured}
      />

      {showModal && (
        <ProjectModal
          project={editingProject}
          categories={categories}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default ProjectsTab;
