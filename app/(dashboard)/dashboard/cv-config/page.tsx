"use client";

import { config } from "@/lib/config";
import {
  IconCheck,
  IconEdit,
  IconExternalLink,
  IconFilter,
  IconPlus,
  IconSearch,
  IconStar,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import CreateCVModal from "./create-cv-modal";
import EditCVModal from "./edit-cv-modal";
import type { CVShowcase, Notification } from "./types";

const CVConfigPage = () => {
  const [cvShowcases, setCvShowcases] = useState<CVShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCV, setEditingCV] = useState<CVShowcase | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchCVShowcases = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "12");
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedTag) params.append("tag", selectedTag);
      if (featuredFilter !== null)
        params.append("isFeatured", featuredFilter.toString());

      const response = await axios.get(
        `${config.baseUrl}/api/cv-showcase?${params}`,
      );
      setCvShowcases(response.data.cvShowcases || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch CV showcases");
      console.error("Error fetching CV showcases:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, selectedTag, featuredFilter]);

  const fetchFilters = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        axios.get(`${config.baseUrl}/api/cv-showcase/categories/all`),
        axios.get(`${config.baseUrl}/api/cv-showcase/tags/all`),
      ]);
      setCategories(categoriesRes.data || []);
      setTags(tagsRes.data || []);
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  };

  const deleteCVShowcase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV showcase?")) return;
    try {
      await axios.delete(`${config.baseUrl}/api/cv-showcase/${id}`);
      fetchCVShowcases();
      showNotification("success", "CV showcase deleted successfully!");
    } catch (err) {
      setError("Failed to delete CV showcase");
      showNotification("error", "Failed to delete CV showcase");
      console.error("Error deleting CV showcase:", err);
    }
  };

  const openEditModal = (cv: CVShowcase) => {
    setEditingCV(cv);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchCVShowcases();
  }, [fetchCVShowcases]);

  useEffect(() => {
    fetchFilters();
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedTag("");
    setFeaturedFilter(null);
    setCurrentPage(1);
  };

  if (loading && cvShowcases.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading CV showcases...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ${
                notification.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {notification.type === "success" ? (
                <IconCheck size={20} className="flex-shrink-0" />
              ) : (
                <IconX size={20} className="flex-shrink-0" />
              )}
              <span className="text-sm font-medium">
                {notification.message}
              </span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-auto flex-shrink-0 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <IconX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-fg text-3xl font-bold">CV Showcase</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary-dark text-bg flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors"
        >
          <IconPlus size={20} />
          Add CV Showcase
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="mb-4 flex items-center gap-2">
          <IconFilter size={20} className="text-text-muted" />
          <h3 className="text-fg font-medium">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-primary hover:text-primary-dark ml-auto text-sm transition-colors"
          >
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <IconSearch
              size={16}
              className="text-text-muted absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Search CV showcases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border py-2 pr-3 pl-10 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-secondary/40 border-border text-fg focus:ring-primary/50 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-secondary/40 border-border text-fg focus:ring-primary/50 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select
            value={featuredFilter === null ? "" : featuredFilter.toString()}
            onChange={(e) =>
              setFeaturedFilter(
                e.target.value === "" ? null : e.target.value === "true",
              )
            }
            className="bg-secondary/40 border-border text-fg focus:ring-primary/50 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="">All Showcases</option>
            <option value="true">Featured</option>
            <option value="false">Regular</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {/* CV Showcase Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cvShowcases.map((cv) => (
          <div
            key={cv._id}
            className="bg-card border-border hover:border-primary/30 relative overflow-hidden rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
          >
            {cv.isFeatured && (
              <div className="absolute top-3 right-3 z-10">
                <div className="rounded-full bg-yellow-500 p-1.5 text-white shadow-md">
                  <IconStar size={14} fill="currentColor" />
                </div>
              </div>
            )}
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-fg line-clamp-2 text-lg leading-tight font-semibold">
                {cv.title}
              </h3>
            </div>
            <p className="text-text-secondary mb-4 line-clamp-3 text-sm leading-relaxed">
              {cv.content.replace(/<[^>]*>/g, "")}
            </p>
            {cv.quote && (
              <div className="border-primary/30 mb-4 border-l-4 pl-3">
                <p className="text-text-muted text-sm italic">
                  &ldquo;{cv.quote}&rdquo;
                </p>
              </div>
            )}
            {cv.skills && cv.skills.length > 0 && (
              <div className="mb-4">
                <p className="text-fg mb-2 text-xs font-semibold">Skills:</p>
                <div className="space-y-1">
                  {cv.skills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-text-secondary text-xs">
                        {skill.name}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IconStar
                            key={star}
                            size={12}
                            className={
                              star <= skill.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {cv.skills.length > 3 && (
                    <span className="text-text-muted text-xs">
                      +{cv.skills.length - 3} more skills
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="mb-4 space-y-1">
              <p className="text-primary text-sm font-medium capitalize">
                {cv.category}
              </p>
              <p className="text-text-muted text-xs">
                {new Date(cv.createdAt).toLocaleDateString()}
              </p>
            </div>
            {cv.tags && cv.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {cv.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {cv.tags.length > 3 && (
                  <span className="text-text-muted self-center text-xs">
                    +{cv.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
            {cv.cv_url && (
              <div className="mb-4">
                <a
                  href={cv.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  <IconExternalLink size={14} />
                  View CV
                </a>
              </div>
            )}
            {cv.attachments && cv.attachments.length > 0 && (
              <div className="mb-4">
                <p className="text-text-muted text-xs">
                  {cv.attachments.length} attachment(s)
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(cv)}
                className="bg-primary/10 hover:bg-primary/20 text-primary flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <IconEdit size={16} className="mr-1.5 inline" />
                Edit
              </button>
              {cv.cv_url && (
                <a
                  href={`/cv?slug=${cv.cv_url.split("/").pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border hover:border-primary/50 text-text-secondary hover:text-primary flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                  title="View CV"
                >
                  <IconExternalLink size={16} />
                </a>
              )}
              <button
                onClick={() => deleteCVShowcase(cv._id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:scale-105 hover:border-red-300 hover:text-red-700"
              >
                <IconTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && cvShowcases.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-text-muted mb-4">No CV showcases found</div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors"
          >
            Create your first CV showcase
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-secondary/40 hover:bg-secondary/60 text-fg rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-text-secondary text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-secondary/40 hover:bg-secondary/60 text-fg rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateCVModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchCVShowcases}
          showNotification={showNotification}
        />
      )}

      {showEditModal && editingCV && (
        <EditCVModal
          cv={editingCV}
          onClose={() => {
            setShowEditModal(false);
            setEditingCV(null);
          }}
          onSuccess={fetchCVShowcases}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

export default CVConfigPage;
