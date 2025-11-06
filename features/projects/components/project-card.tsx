"use client";

import { Project } from "@/types/data";
import {
  IconBrandGithub,
  IconExternalLink,
  IconEye,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Helper function to get project thumbnail URL
const getProjectThumbnailUrl = (project: Project) => {
  // Use the first screenshot as thumbnail if available
  if (!project.screenshots || project.screenshots.length === 0) return null;

  const thumbnailUrl = project.screenshots[0].url;

  if (thumbnailUrl.startsWith("http")) {
    return thumbnailUrl;
  }

  return `http://localhost:8000${thumbnailUrl.startsWith("/") ? "" : "/"}${thumbnailUrl}`;
};

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number = 120) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

// Helper function to truncate title
const truncateTitle = (title: string, maxLength: number = 35) => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength).trim() + "...";
};

// Helper function to truncate slug
const truncateSlug = (slug: string, maxLength: number = 25) => {
  if (slug.length <= maxLength) return slug;
  return slug.substring(0, maxLength).trim() + "...";
};

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  const projectImage = getProjectThumbnailUrl(project);

  return (
    <div className="bg-secondary/20 border-primary/10 m-4 flex h-full w-full max-w-[30rem] flex-col rounded-2xl border p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="bg-primary/20 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full">
          <span className="text-primary text-sm font-bold">
            {project.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="flex flex-col">
            <span
              className="block truncate text-sm leading-tight font-semibold text-white"
              title={project.name}
            >
              {truncateTitle(project.name, 35)}
            </span>
            <div className="mt-1 flex items-center gap-2 overflow-hidden text-xs opacity-70">
              <small
                className="text-secondary-fg/60 max-w-[120px] truncate"
                title={`@${project.slug}`}
              >
                @{truncateSlug(project.slug, 20)}
              </small>
              <span className="flex-shrink-0">·</span>
              <small className="text-secondary-fg/60 flex-shrink-0">
                {project.status}
              </small>
            </div>
          </h3>
        </div>
      </div>

      {/* Content - grows to fill available space */}
      <div className="mt-4 flex flex-grow flex-col gap-4">
        <div className="min-h-[60px]">
          <p className="text-secondary-fg text-sm leading-relaxed">
            {(() => {
              let fullText = project.tagline || "";
              if (project.description && project.description.length > 0) {
                const descriptionText =
                  project.description[0]?.children?.[0]?.text || "";
                if (descriptionText) {
                  fullText += fullText
                    ? " " + descriptionText
                    : descriptionText;
                }
              }
              return truncateText(fullText, 100);
            })()}
          </p>
        </div>

        {/* Project Image or Placeholder */}
        <div className="bg-secondary/10 relative h-[160px] overflow-hidden rounded-lg">
          {projectImage && !imageError ? (
            <Image
              src={projectImage}
              alt={project.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-secondary-fg/40 flex h-full items-center justify-center">
              <div className="text-center">
                <IconEye className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-xs">No Preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions - always at bottom */}
      <div className="mt-4 flex justify-evenly gap-2">
        {project.githubURL && (
          <a
            href={project.githubURL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-secondary/40 flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition"
          >
            <IconBrandGithub className="h-4 w-4" />
            <span className="inline text-xs font-medium opacity-90 transition hover:opacity-100 max-sm:hidden">
              Code
            </span>
          </a>
        )}

        {project.liveURL && (
          <a
            href={project.liveURL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-secondary/40 flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition"
          >
            <IconExternalLink className="h-4 w-4" />
            <span className="inline text-xs font-medium opacity-90 transition hover:opacity-100 max-sm:hidden">
              Live
            </span>
          </a>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="hover:bg-secondary/40 flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition"
        >
          <IconEye className="h-4 w-4" />
          <span className="inline text-xs font-medium opacity-90 transition hover:opacity-100 max-sm:hidden">
            Details
          </span>
        </Link>
      </div>
    </div>
  );
};
