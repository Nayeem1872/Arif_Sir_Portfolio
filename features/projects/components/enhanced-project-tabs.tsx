"use client";

import { config } from "@/lib/config";
import { Project } from "@/types/data";
import { cn } from "@/utils/cn";
import {
  IconBrandGithub,
  IconCode,
  IconExternalLink,
  IconRocket,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Helper function to get full image URL
const getImageUrl = (url: string) => {
  if (url.startsWith("http")) {
    return url;
  }
  return `${config.baseUrl}${url}`;
};

const TechChip = ({ tech, index }: { tech: string; index: number }) => {
  const colors = [
    "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "bg-green-500/20 text-green-400 border-green-500/30",
    "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "bg-pink-500/20 text-pink-400 border-pink-500/30",
  ];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        colors[index % colors.length],
      )}
    >
      {tech}
    </motion.span>
  );
};

const ProjectCard = ({
  project,
  isActive,
}: {
  project: Project;
  isActive: boolean;
}) => {
  const projectImage = project.screenshots?.[0]?.url
    ? getImageUrl(project.screenshots[0].url)
    : "/placeholder-project.jpg";

  return (
    <motion.div
      layout
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border transition-all duration-500",
        isActive
          ? "border-primary/50 from-secondary/40 to-secondary/20 bg-gradient-to-br"
          : "border-border/30 bg-secondary/20",
      )}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={projectImage}
          alt={project.name}
          fill
          className="object-cover opacity-20"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-8">
        {/* Header */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 flex items-center gap-2"
          >
            <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-primary text-sm font-bold">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-primary/80 text-sm font-medium">
              Featured Project
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3 text-3xl font-bold text-white"
          >
            {project.name}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-secondary-fg/80 text-lg leading-relaxed"
          >
            {project.tagline}
          </motion.p>
        </div>

        {/* Technologies */}
        {project.tags && project.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 4).map((tag, index) => (
                <TechChip key={tag} tech={tag} index={index} />
              ))}
              {project.tags.length > 4 && (
                <span className="text-secondary-fg/60 text-xs">
                  +{project.tags.length - 4} more
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Project Image Preview */}
        {project.screenshots?.[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 flex-1"
          >
            <div className="border-border/30 relative h-48 overflow-hidden rounded-xl border">
              <Image
                src={getImageUrl(project.screenshots[0].url)}
                alt={`${project.name} preview`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-auto flex gap-3"
        >
          {project.liveURL && (
            <a
              href={project.liveURL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/80 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-colors"
            >
              <IconRocket className="h-4 w-4" />
              Live Demo
            </a>
          )}

          {project.githubURL && (
            <a
              href={project.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border bg-secondary/40 hover:bg-secondary flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors"
            >
              <IconBrandGithub className="h-4 w-4" />
              Source
            </a>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="border-border bg-secondary/40 hover:bg-secondary flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors"
          >
            <IconExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EnhancedProjectTabs = ({ projects }: { projects: Project[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!projects || projects.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <IconCode className="text-secondary-fg/40 mx-auto mb-4 h-16 w-16" />
          <p className="text-secondary-fg/60">No projects available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto hidden h-[70vh] w-full max-w-6xl flex-col items-start justify-start md:flex">
      {/* Tab Navigation */}
      <div className="mb-8 flex w-full justify-center">
        <div className="bg-secondary/20 border-border/30 flex rounded-full border p-1 backdrop-blur-sm">
          {projects.map((project, index) => (
            <button
              key={project._id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative rounded-full px-6 py-3 text-sm font-medium transition-all duration-300",
                activeIndex === index
                  ? "text-white"
                  : "text-secondary-fg/60 hover:text-secondary-fg",
              )}
            >
              {activeIndex === index && (
                <motion.div
                  layoutId="activeTab"
                  className="bg-primary absolute inset-0 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{project.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <ProjectCard project={projects[activeIndex]} isActive={true} />
          </motion.div>
        </AnimatePresence>

        {/* Background Cards for Depth Effect */}
        <div className="absolute inset-0 -z-10">
          {projects.map((project, index) => {
            if (index === activeIndex) return null;

            const offset = index < activeIndex ? -1 : 1;
            const scale = 0.95 - Math.abs(index - activeIndex) * 0.05;

            return (
              <motion.div
                key={project._id}
                className="border-border/20 bg-secondary/10 absolute inset-0 rounded-2xl border"
                style={{
                  transform: `translateX(${offset * 20}px) scale(${scale})`,
                  zIndex: -Math.abs(index - activeIndex),
                }}
                animate={{
                  opacity: 0.3 - Math.abs(index - activeIndex) * 0.1,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="mt-6 flex w-full justify-center gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeIndex === index
                ? "bg-primary w-8"
                : "bg-secondary-fg/30 hover:bg-secondary-fg/50 w-2",
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedProjectTabs;
