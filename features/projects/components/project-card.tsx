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

// Helper function to get full image URL
const getImageUrl = (url: string) => {
  if (url.startsWith("http")) {
    return url;
  }
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com"
      : "http://localhost:8000";
  return `${baseUrl}${url}`;
};

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  const projectImage = project.screenshots?.[0]?.url
    ? getImageUrl(project.screenshots[0].url)
    : null;

  return (
    <div className="bg-secondary/20 border-primary/10 m-4 w-full max-w-[30rem] rounded-2xl border p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 flex h-9 w-9 items-center justify-center rounded-full">
            <span className="text-primary text-sm font-bold">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="flex flex-col">
              <span className="font-semibold text-white">{project.name}</span>
              <span className="flex items-center gap-2 text-sm opacity-70">
                <small className="text-secondary-fg/60">@{project.slug}</small>
                <span>·</span>
                <small className="text-secondary-fg/60">{project.status}</small>
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-col gap-4">
        <p className="text-secondary-fg leading-relaxed whitespace-pre-wrap">
          {project.tagline}
          {project.description && project.description.length > 0 && (
            <>
              <br />
              <br />
              {project.description[0]?.children?.[0]?.text}
            </>
          )}
        </p>

        {/* Project Image */}
        {projectImage && !imageError && (
          <div className="relative">
            <Image
              src={projectImage}
              alt={project.name}
              width={400}
              height={200}
              className="max-w-full rounded-lg object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-evenly gap-2">
        {project.githubURL && (
          <a
            href={project.githubURL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-secondary/40 flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition"
          >
            <IconBrandGithub className="h-4 w-4" />
            <span className="inline text-[14px] font-medium opacity-90 transition hover:opacity-100 max-sm:hidden">
              Code
            </span>
          </a>
        )}

        {project.liveURL && (
          <a
            href={project.liveURL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-secondary/40 flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition"
          >
            <IconExternalLink className="h-4 w-4" />
            <span className="inline text-[14px] font-medium opacity-90 transition hover:opacity-100 max-sm:hidden">
              Live
            </span>
          </a>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="hover:bg-secondary/40 flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition"
        >
          <IconEye className="h-4 w-4" />
          <span className="inline text-[14px] font-medium opacity-90 transition hover:opacity-100 max-sm:hidden">
            Details
          </span>
        </Link>
      </div>
    </div>
  );
};
