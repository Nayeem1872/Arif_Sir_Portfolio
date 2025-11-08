"use client";

import { config } from "@/lib/config";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import ProjectForm from "./ProjectForm";

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

interface ProjectModalProps {
  project?: Project | null;
  categories: ProjectCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectModal = ({
  project,
  categories,
  onClose,
  onSuccess,
}: ProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!project;

  const handleFormSubmit = async (formDataToSend: FormData) => {
    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `${config.apiBaseUrl}/projects/${project._id}`
        : `${config.apiBaseUrl}/projects`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to save project");
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      setError("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border-border relative z-50 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border shadow-lg">
        <div className="bg-card border-border relative sticky top-0 z-60 border-b p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-fg text-lg font-semibold">
              {isEditing ? "Edit Project" : "Add Project"}
            </h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-fg rounded p-1 transition-colors"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <ProjectForm
            project={project}
            categories={categories}
            onSubmit={handleFormSubmit}
            loading={loading}
            error={error}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border-border text-fg hover:bg-secondary/20 rounded-md border px-4 py-2 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
