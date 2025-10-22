import {
  IconExternalLink,
  IconEye,
  IconHeart,
  IconPlus,
} from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Dashboard",
  description: "Manage your projects",
};

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution built with Next.js",
    status: "Published",
    views: 1234,
    likes: 89,
  },
  {
    title: "Task Management App",
    description: "React-based task management with real-time updates",
    status: "Draft",
    views: 567,
    likes: 45,
  },
  {
    title: "Portfolio Website",
    description: "Personal portfolio showcasing my work and skills",
    status: "Published",
    views: 2345,
    likes: 156,
  },
];

const ProjectsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-fg text-3xl font-bold">Projects</h1>
        <button className="bg-primary hover:bg-primary-dark text-bg flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors">
          <IconPlus size={20} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-card border-border hover:border-primary/20 rounded-lg border p-6 transition-colors"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-fg text-lg font-semibold">{project.title}</h3>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  project.status === "Published"
                    ? "bg-primary/20 text-primary"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {project.status}
              </span>
            </div>

            <p className="text-fg/60 mb-4 text-sm">{project.description}</p>

            <div className="text-fg/60 mb-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <IconEye size={16} />
                  <span>{project.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconHeart size={16} />
                  <span>{project.likes}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-secondary/40 hover:bg-secondary/60 text-fg flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors">
                Edit
              </button>
              <button className="border-border hover:border-primary/50 rounded-md border px-3 py-2 text-sm font-medium transition-colors">
                <IconExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
