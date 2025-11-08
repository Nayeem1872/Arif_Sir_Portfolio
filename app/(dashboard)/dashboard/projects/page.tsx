"use client";

import { useState } from "react";
import CategoriesTab from "./components/CategoriesTab";
import ProjectsTab from "./components/ProjectsTab";

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState<"categories" | "projects">(
    "categories",
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-fg text-2xl font-bold sm:text-3xl">
          Projects Management
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-border overflow-hidden rounded-lg border">
        <div className="border-border flex overflow-x-auto border-b">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-6 ${
              activeTab === "categories"
                ? "text-primary border-primary bg-primary/5 border-b-2"
                : "text-text-muted hover:text-fg"
            }`}
          >
            Project Categories
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-6 ${
              activeTab === "projects"
                ? "text-primary border-primary bg-primary/5 border-b-2"
                : "text-text-muted hover:text-fg"
            }`}
          >
            Projects
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "projects" && <ProjectsTab />}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
