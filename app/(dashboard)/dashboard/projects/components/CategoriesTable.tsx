"use client";

import { IconEdit, IconTrash } from "@tabler/icons-react";

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

interface CategoriesTableProps {
  categories: ProjectCategory[];
  loading: boolean;
  onEdit: (category: ProjectCategory) => void;
  onDelete: (id: string) => void;
}

const CategoriesTable = ({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoriesTableProps) => {
  if (loading) {
    return (
      <div className="bg-card border-border rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-text-muted">Loading categories...</div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-card border-border rounded-lg border">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-text-muted mb-2">No categories found</div>
          <div className="text-text-muted text-sm">
            Create your first category to get started
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/20 border-border border-b">
            <tr>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Category
              </th>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Description
              </th>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Created
              </th>
              <th className="text-fg px-6 py-3 text-right text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-secondary/10">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <div className="text-fg font-medium">{category.name}</div>
                      <div className="text-text-muted text-sm">
                        {category.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-fg max-w-xs truncate text-sm">
                    {category.description || "No description"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-text-muted text-sm">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="rounded p-1 text-blue-500 transition-colors hover:bg-blue-50"
                      title="Edit Category"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(category._id)}
                      className="rounded p-1 text-red-500 transition-colors hover:bg-red-50"
                      title="Delete Category"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTable;
