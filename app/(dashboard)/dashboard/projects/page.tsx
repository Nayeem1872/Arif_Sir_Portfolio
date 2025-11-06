"use client";

import { useState } from "react";
import CategoriesTab from "./components/CategoriesTab";
import ProjectsTab from "./components/ProjectsTab";

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState<"categories" | "projects">(
    "categories",
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-fg text-3xl font-bold">Projects Management</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-border rounded-lg border">
        <div className="border-border flex border-b">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "categories"
                ? "text-primary border-primary bg-primary/5 border-b-2"
                : "text-text-muted hover:text-fg"
            }`}
          >
            Project Categories
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "projects"
                ? "text-primary border-primary bg-primary/5 border-b-2"
                : "text-text-muted hover:text-fg"
            }`}
          >
            Projects
          </button>
        </div>

        <div className="p-6">
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "projects" && <ProjectsTab />}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
