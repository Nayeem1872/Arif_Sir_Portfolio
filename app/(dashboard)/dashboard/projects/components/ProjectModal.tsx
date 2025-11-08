"use client";

import { config } from "@/lib/config";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-secondary/40 border-border h-32 w-full animate-pulse rounded-md border" />
    ),
  },
);

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${config.imageBaseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

// Helper function to strip HTML tags and get plain text length
const getPlainTextLength = (html: string): number => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim().length;
};



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
    thumbnailImage: null as File | null,
    images: [] as File[],
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const isEditing = !!project;

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        categoryId: project.categoryId._id,
        thumbnailImage: null,
        images: [],
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
      setExistingImages(project.images || []);
      setRemovedImages([]);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate short description length
    if (getPlainTextLength(formData.shortDescription) > 300) {
      setError(
        "Short description must be 300 characters or less (excluding HTML tags)",
      );
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("liveUrl", formData.liveUrl);
      formDataToSend.append("sourceCodeUrl", formData.sourceCodeUrl);
      formDataToSend.append("demoUrl", formData.demoUrl);
      formDataToSend.append("isPublished", formData.isPublished.toString());
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("completedAt", formData.completedAt);

      // Add arrays (filter out empty strings)
      const cleanTechnologies = formData.technologies.filter(
        (tech) => tech.trim() !== "",
      );
      const cleanFeatures = formData.features.filter(
        (feature) => feature.trim() !== "",
      );

      cleanTechnologies.forEach((tech) => {
        formDataToSend.append("technologies[]", tech);
      });

      cleanFeatures.forEach((feature) => {
        formDataToSend.append("features[]", feature);
      });

      // Add thumbnail image
      if (formData.thumbnailImage) {
        formDataToSend.append("thumbnailImage", formData.thumbnailImage);
      }

      // Add additional images
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Add removed images list (for edit mode)
      if (isEditing && removedImages.length > 0) {
        removedImages.forEach((imageUrl) => {
          formDataToSend.append("removedImages[]", imageUrl);
        });
      }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "thumbnailImage") {
        setFormData((prev) => ({
          ...prev,
          thumbnailImage: files[0],
        }));
      }
    }
  };

  const handleMultipleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => {
        const newImages = [...prev.images];
        newImages[index] = files[0];
        return {
          ...prev,
          images: newImages,
        };
      });
    }
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
    if (field === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, null as unknown as File],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), ""],
      }));
    }
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    if (field === "images") {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }));
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
              <label className="text-fg mb-2 flex items-center justify-between text-sm font-medium">
                <span>Short Description</span>
                <span
                  className={`text-xs ${
                    getPlainTextLength(formData.shortDescription) > 300
                      ? "text-red-500"
                      : "text-text-muted"
                  }`}
                >
                  {getPlainTextLength(formData.shortDescription)}/300 characters
                </span>
              </label>
              <RichTextEditor
                value={formData.shortDescription}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: value,
                  }))
                }
                placeholder="Brief description for cards and previews..."
                className="min-h-[120px]"
              />
              {getPlainTextLength(formData.shortDescription) > 300 && (
                <p className="mt-1 text-xs text-red-500">
                  Short description exceeds 300 characters. Please shorten it.
                </p>
              )}
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Detailed Description *
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder="Detailed project description..."
                className="min-h-[200px]"
              />
            </div>

            {/* Images */}
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Thumbnail Image *
              </label>

              {/* Show existing thumbnail when editing */}
              {isEditing && project?.thumbnailImage && (
                <div className="mb-3">
                  <p className="text-text-muted mb-2 text-sm">
                    Current thumbnail:
                  </p>
                  <img
                    src={getImageUrl(project.thumbnailImage)}
                    alt="Current thumbnail"
                    className="border-border h-20 w-20 rounded-lg border object-cover"
                  />
                </div>
              )}

              <input
                type="file"
                name="thumbnailImage"
                onChange={handleFileChange}
                accept="image/*"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                required={!isEditing}
              />
              {formData.thumbnailImage && (
                <p className="text-text-muted mt-1 text-sm">
                  Selected: {formData.thumbnailImage.name}
                </p>
              )}
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

              {/* Show existing images when editing */}
              {isEditing && existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-text-muted mb-2 text-sm">
                    Current images:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={getImageUrl(image)}
                          alt={`Project image ${index + 1}`}
                          className="border-border h-16 w-16 rounded-lg border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setRemovedImages((prev) => [...prev, image]);
                            setExistingImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                          title="Remove image"
                        >
                          <IconX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-text-muted mt-1 text-xs">
                    Click X to remove images, or upload new images below
                  </p>
                </div>
              )}

              {formData.images.map((image, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={(e) => handleMultipleFileChange(e, index)}
                      accept="image/*"
                      className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    />
                    {image && (
                      <p className="text-text-muted mt-1 text-xs">
                        Selected: {image.name}
                      </p>
                    )}
                  </div>
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
                disabled={
                  loading || getPlainTextLength(formData.shortDescription) > 300
                }
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
