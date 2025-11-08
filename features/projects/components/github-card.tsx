"use client";

import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { config } from "@/lib/config";
import { Project } from "@/types/data";
import {
  IconArchive,
  IconArrowUpRight,
  IconBrandGithub,
  IconCircleDotted,
  IconCode,
  IconLock,
  IconWorld,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import LanguageBar from "./language-bar";

// Helper function to get full image URL
const getImageUrl = (url: string) => {
  if (url.startsWith("http")) {
    return url; // Already a full URL
  }
  // Add the image base URL for relative paths
  return `${config.imageBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number = 80) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

// Helper function to truncate title
const truncateTitle = (title: string, maxLength: number = 25) => {
  if (!title || title.length <= maxLength) return title;
  return title.substring(0, maxLength).trim() + "...";
};

const GitHubCard = ({ project }: { project: Project }) => {
  const renderStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "live":
        return <IconWorld size={16} className="mr-1 inline-block" />;
      case "archived":
        return <IconArchive size={16} className="mr-1 inline-block" />;
      case "development":
        return <IconCode size={16} className="mr-1 inline-block" />;
      default:
        return <IconCircleDotted size={16} className="mr-1 inline-block" />;
    }
  };

  return (
    <AnimatedTooltip
      tooltip={
        <div className="flex w-full min-w-[200px] flex-col gap-px">
          <div className="mb-1 flex items-center">
            <div className="bg-secondary-fg/20 flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-secondary-fg/60 text-sm font-medium">
                {project.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span
              className="ml-2 text-sm font-medium capitalize"
              title={project.name}
            >
              {truncateTitle(project.name || "", 20)}
            </span>
          </div>
          <span className="text-xs" title={project.tagline}>
            {truncateText(project.tagline || "", 60)}
          </span>
          <div className="text-fg/80 flex items-center self-end text-xs">
            <span className="font-medium">Click to view</span>
            <IconArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      }
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block h-full w-full p-1"
      >
        <div className="bg-secondary/40 hover:bg-secondary relative flex h-[280px] w-full flex-col overflow-hidden rounded-lg transition-colors">
          {/* Project Image or Placeholder */}
          <div className="bg-secondary/10 relative h-32 w-full">
            {project.screenshots && project.screenshots.length > 0 ? (
              <Image
                src={getImageUrl(project.screenshots[0].url)}
                alt={project.name || "Project image"}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="text-secondary-fg/40 flex h-full items-center justify-center">
                <div className="text-center">
                  <IconCode className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p className="text-xs">No Preview</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
            {/* Title and Description */}
            <div className="mb-3 flex-1">
              <div className="overflow-hidden">
                <h3
                  className="mb-1 truncate text-sm font-medium"
                  title={project.name}
                >
                  {truncateTitle(project.name || "", 25)}
                </h3>
                <div className="min-h-[32px]">
                  <p
                    className="text-secondary-fg text-xs leading-relaxed"
                    title={project.tagline}
                  >
                    {truncateText(project.tagline || "", 80)}
                  </p>
                </div>
              </div>
            </div>

            {/* Icons bar */}
            <div className="mb-2 flex gap-2">
              {project.githubURL ? (
                <div className="bg-fg/10 flex items-center gap-1 rounded-lg px-2 py-1 text-xs">
                  <IconBrandGithub size={16} className="stroke-[1.5]" />
                  <span>Public</span>
                </div>
              ) : (
                <div className="bg-fg/10 flex items-center gap-1 rounded-lg px-2 py-1 text-xs">
                  <IconLock size={16} className="stroke-[1.5]" />
                  <span>Private</span>
                </div>
              )}
              {project.status && (
                <div className="bg-fg/10 flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:brightness-110">
                  {renderStatusIcon(project.status)}
                  <span className="capitalize">{project.status}</span>
                </div>
              )}
            </div>

            {/* Language bar - always at bottom */}
            <div className="mt-auto">
              <LanguageBar project={project} />
            </div>
          </div>
        </div>
      </Link>
    </AnimatedTooltip>
  );
};

export default GitHubCard;
