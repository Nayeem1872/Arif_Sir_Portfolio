"use client";

import { IconX } from "@tabler/icons-react";
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

interface CategoryModalProps {
  category?: ProjectCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryModal = ({
  category,
  onClose,
  onSuccess,
}: CategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `http://localhost:8000/api/project-categories/${category._id}`
        : "http://localhost:8000/api/project-categories";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Failed to save category:", error);
      setError("Failed to save category. Please try again.");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border-border w-full max-w-md rounded-lg border p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-fg text-lg font-semibold">
            {isEditing ? "Edit Category" : "Add Category"}
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-fg rounded p-1 transition-colors"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="e.g. Web Development"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="Brief description of this category..."
              maxLength={500}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="text-primary focus:ring-primary/50 rounded border-gray-300"
              />
              <span className="text-fg text-sm">Active category</span>
            </label>
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
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
