"use client";
import type { ProjectApiResponse } from "@/types/data";
import { getLanguageColor } from "@/utils/get-language-color";

const LanguageBar = ({ project }: { project: ProjectApiResponse }) => {
  if (!project) return null;

  // Since ProjectApiResponse doesn't have languages, we'll show technologies instead
  return (
    <div className="absolute inset-x-0 bottom-0 mt-4 flex h-2 overflow-hidden rounded-b-lg">
      {project.technologies?.slice(0, 3)?.map((tech, index) => (
        <div
          key={tech}
          className={`group bg-secondary relative h-2`}
          style={{
            width: `${100 / Math.min(project.technologies?.length || 1, 3)}%`,
            backgroundColor: getLanguageColor(tech ?? ""),
          }}
        ></div>
      ))}
    </div>
  );
};

export default LanguageBar;
