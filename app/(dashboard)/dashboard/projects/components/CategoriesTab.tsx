"use client";

import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";

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

const CategoriesTab = () => {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProjectCategory | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/project-categories",
      );
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: ProjectCategory) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/project-categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-fg text-xl font-semibold">Project Categories</h2>
          <p className="text-text-muted text-sm">
            Manage project categories and their settings
          </p>
        </div>
        <button
          onClick={handleAddCategory}
          className="bg-primary hover:bg-primary-dark text-bg flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors"
        >
          <IconPlus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <CategoriesTable
        categories={categories}
        loading={loading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default CategoriesTab;
