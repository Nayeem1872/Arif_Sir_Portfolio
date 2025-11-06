"use client";

import { config } from "@/lib/config";
import {
  IconEdit,
  IconExternalLink,
  IconEye,
  IconHeart,
  IconTrash,
} from "@tabler/icons-react";

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

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, isPublished: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
}

const ProjectsTable = ({
  projects,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}: ProjectsTableProps) => {
  if (loading) {
    return (
      <div className="bg-card border-border rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-text-muted">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-card border-border rounded-lg border">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-text-muted mb-2">No projects found</div>
          <div className="text-text-muted text-sm">
            Create your first project to get started
          </div>
        </div>
      </div>
    );
  }
  console.log("projects", projects);

  return (
    <div className="bg-card border-border overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/20 border-border border-b">
            <tr>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Project
              </th>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Category
              </th>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="text-fg px-6 py-3 text-left text-sm font-medium">
                Technologies
              </th>
              <th className="text-fg px-6 py-3 text-right text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-secondary/10">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
                      {project.thumbnailImage ? (
                        <img
                          src={`${config.apiBaseUrl.replace("/api", "")}${project.thumbnailImage}`}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-fg font-medium">{project.title}</div>
                      <div className="text-text-muted max-w-xs truncate text-sm">
                        {project.shortDescription}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: project.categoryId.color }}
                  >
                    {project.categoryId.icon} {project.categoryId.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        project.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                    {project.isFeatured && (
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex max-w-xs flex-wrap gap-1">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary/40 text-fg rounded px-2 py-1 text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="text-text-muted text-xs">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                        title="View Live Project"
                      >
                        <IconExternalLink className="h-3 w-3" />
                        Live
                      </a>
                    )}

                    <button
                      onClick={() =>
                        onToggleFeatured(project._id, project.isFeatured)
                      }
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                        project.isFeatured
                          ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                      title={
                        project.isFeatured
                          ? "Remove from Featured"
                          : "Mark as Featured"
                      }
                    >
                      <IconHeart
                        className={`h-3 w-3 ${project.isFeatured ? "fill-current" : ""}`}
                      />
                      {project.isFeatured ? "Featured" : "Feature"}
                    </button>

                    <button
                      onClick={() =>
                        onTogglePublished(project._id, project.isPublished)
                      }
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                        project.isPublished
                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                      title={
                        project.isPublished
                          ? "Unpublish Project"
                          : "Publish Project"
                      }
                    >
                      <IconEye className="h-3 w-3" />
                      {project.isPublished ? "Published" : "Draft"}
                    </button>

                    <button
                      onClick={() => onEdit(project)}
                      className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                      title="Edit Project"
                    >
                      <IconEdit className="h-3 w-3" />
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(project._id)}
                      className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      title="Delete Project"
                    >
                      <IconTrash className="h-3 w-3" />
                      Delete
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

export default ProjectsTable;
