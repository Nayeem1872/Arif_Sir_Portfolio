import type { ProjectApiResponse } from "@/types/data";
import { useEffect, useMemo, useState } from "react";

export function useProjectSearch(projects: ProjectApiResponse[]) {
  const [filtered, setFiltered] = useState<ProjectApiResponse[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    setFiltered(projects);
  }, [projects]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (debouncedSearch.trim() === "") {
        setFiltered(projects);
      } else {
        const filteredProjects = projects.filter(
          (p) =>
            p.title?.toLowerCase().includes(debouncedSearch) ||
            p.shortDescription?.toLowerCase().includes(debouncedSearch) ||
            p.description?.toLowerCase().includes(debouncedSearch) ||
            p.slug?.toLowerCase().includes(debouncedSearch) ||
            p.technologies?.some((tech) =>
              tech.toLowerCase().includes(debouncedSearch),
            ),
        );
        setFiltered(filteredProjects);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [debouncedSearch, projects]);

  // Tags change based on filtered projects (using technologies as tags)
  const tags = useMemo(() => {
    const allTags = filtered.flatMap((project) => {
      if (!project.technologies) return [];
      return project.technologies;
    });
    return Array.from(new Set(allTags.map((tag) => tag.toLowerCase())));
  }, [filtered]);

  // Double filtering: first by search, then by tags
  const activeProjects = useMemo(() => {
    if (activeTags.length === 0) {
      return filtered;
    }
    return filtered.filter((project) => {
      if (!project.technologies) return false;
      const projectTags = project.technologies.map((tech) =>
        tech.toLowerCase(),
      );
      return activeTags.some((activeTag) => projectTags.includes(activeTag));
    });
  }, [filtered, activeTags]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm.trim() === "") {
      setFiltered(projects);
      return;
    }

    setDebouncedSearch(searchTerm);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value;
    const sortedProjects = [...filtered];

    if (sortValue === "recent") {
      sortedProjects.sort(
        (a, b) =>
          new Date(b.updatedAt ?? "").getTime() -
          new Date(a.updatedAt ?? "").getTime(),
      );
    } else if (sortValue === "alphabetical") {
      sortedProjects.sort((a, b) => a.title?.localeCompare(b.title || "") || 0);
    }

    setFiltered(sortedProjects);
  };

  const handleTagChange = (tag: string) => {
    let newTags = [...activeTags];
    if (activeTags.includes(tag)) {
      newTags = newTags.filter((t) => t !== tag);
      setActiveTags(newTags);
    } else {
      newTags.push(tag);
      setActiveTags(newTags);
    }
  };

  const clearTags = () => {
    setActiveTags([]);
  };

  const resetSearch = () => {
    setDebouncedSearch("");
    setFiltered(projects);
    setActiveTags([]);
  };

  return {
    activeProjects,
    tags,
    activeTags,
    handleSearch,
    handleSortChange,
    handleTagChange,
    clearTags,
    resetSearch,
  };
}
