"use client";

import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

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
  shortDescription: string;
  categoryId: ProjectCategory;
  images: string[];
  thumbnailImage: string;
  technologies: string[];
  features: string[];
  liveUrl?: string;
  sourceCodeUrl?: string;
  demoUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likes: number;
  completedAt: string;
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    thumbnailImage: "",
    images: [""],
    technologies: [""],
    features: [""],
    liveUrl: "",
    sourceCodeUrl: "",
    demoUrl: "",
    isPublished: false,
    isFeatured: false,
    completedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!project;

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        categoryId: project.categoryId._id,
        thumbnailImage: project.thumbnailImage,
        images: project.images.length > 0 ? project.images : [""],
        technologies:
          project.technologies.length > 0 ? project.technologies : [""],
        features: project.features.length > 0 ? project.features : [""],
        liveUrl: project.liveUrl || "",
        sourceCodeUrl: project.sourceCodeUrl || "",
        demoUrl: project.demoUrl || "",
        isPublished: project.isPublished,
        isFeatured: project.isFeatured,
        completedAt: project.completedAt
          ? project.completedAt.split("T")[0]
          : "",
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        images: formData.images.filter((img) => img.trim() !== ""),
        technologies: formData.technologies.filter(
          (tech) => tech.trim() !== "",
        ),
        features: formData.features.filter((feature) => feature.trim() !== ""),
      };

      const url = isEditing
        ? `http://localhost:8000/api/projects/${project._id}`
        : "http://localhost:8000/api/projects";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(cleanedData),
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayChange = (
    field: keyof typeof formData,
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const addArrayItem = (field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border-border max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border shadow-lg">
        <div className="bg-card border-border sticky top-0 border-b p-6">
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
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="e.g. AI Code Generator"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter((cat) => cat.isActive)
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Brief description for cards and previews..."
                maxLength={300}
              />
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Detailed project description..."
                required
              />
            </div>

            {/* Images */}
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Thumbnail Image *
              </label>
              <input
                type="url"
                name="thumbnailImage"
                value={formData.thumbnailImage}
                onChange={handleChange}
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-fg text-sm font-medium">
                  Additional Images
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("images")}
                  className="text-primary hover:bg-primary/10 flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors"
                >
                  <IconPlus className="h-3 w-3" />
                  Add Image
                </button>
              </div>
              {formData.images.map((image, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) =>
                      handleArrayChange("images", index, e.target.value)
                    }
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("images", index)}
                      className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-fg text-sm font-medium">
                  Technologies
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("technologies")}
                  className="text-primary hover:bg-primary/10 flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors"
                >
                  <IconPlus className="h-3 w-3" />
                  Add Technology
                </button>
              </div>
              {formData.technologies.map((tech, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) =>
                      handleArrayChange("technologies", index, e.target.value)
                    }
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                  {formData.technologies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("technologies", index)}
                      className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-fg text-sm font-medium">Features</label>
                <button
                  type="button"
                  onClick={() => addArrayItem("features")}
                  className="text-primary hover:bg-primary/10 flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors"
                >
                  <IconPlus className="h-3 w-3" />
                  Add Feature
                </button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      handleArrayChange("features", index, e.target.value)
                    }
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="e.g. Real-time collaboration, AI-powered suggestions"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("features", index)}
                      className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Source Code URL
                </label>
                <input
                  type="url"
                  name="sourceCodeUrl"
                  value={formData.sourceCodeUrl}
                  onChange={handleChange}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Demo URL
                </label>
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleChange}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="https://demo.example.com"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Completion Date
                </label>
                <input
                  type="date"
                  name="completedAt"
                  value={formData.completedAt}
                  onChange={handleChange}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="text-primary focus:ring-primary/50 rounded border-gray-300"
                  />
                  <span className="text-fg text-sm">
                    Published (visible to public)
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="text-primary focus:ring-primary/50 rounded border-gray-300"
                  />
                  <span className="text-fg text-sm">
                    Featured (show on homepage)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="border-border text-fg hover:bg-secondary/20 rounded-md border px-4 py-2 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Project"
                    : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
