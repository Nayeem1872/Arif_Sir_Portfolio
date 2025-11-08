"use client";

import { IconArrowRight, IconCode } from "@tabler/icons-react";
import Link from "next/link";
import { ProjectCard } from "./project-card";

import type { ProjectApiResponse } from "@/types/data";

const ProjectGrid = ({ projects }: { projects: ProjectApiResponse[] }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="text-center">
          <IconCode className="text-secondary-fg/40 mx-auto mb-4 h-16 w-16" />
          <p className="text-secondary-fg/60">No projects available</p>
        </div>
      </div>
    );
  }

  // Filter out projects that don't have required fields
  const validProjects = projects.filter(
    (project): project is ProjectApiResponse =>
      Boolean(project) &&
      Boolean(project._id) &&
      Boolean(project.title) &&
      Boolean(project.slug) &&
      project.isPublished === true,
  );

  if (validProjects.length === 0) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="text-center">
          <IconCode className="text-secondary-fg/40 mx-auto mb-4 h-16 w-16" />
          <p className="text-secondary-fg/60">No valid projects available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      {/* 3-column grid layout */}
      <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
        {validProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {/* View All Projects Button */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/projects"
          className="outline-button group mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 transition-all duration-200 hover:scale-105"
        >
          <IconArrowRight className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>View All Projects</span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectGrid;
