"use client";

import { config } from "@/lib/config";
import {
  IconCheck,
  IconEdit,
  IconExternalLink,
  IconFileText,
  IconFilter,
  IconPlus,
  IconSearch,
  IconStar,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-secondary/40 border-border h-32 w-full animate-pulse rounded-md border" />
    ),
  },
);

interface Skill {
  name: string;
  rating: number;
}

interface CVShowcase {
  _id: string;
  title: string;
  content: string;
  quote?: string;
  skills: Skill[];
  attachments: string[];
  cv_url?: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

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
  const [creating, setCreating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCV, setEditingCV] = useState<CVShowcase | null>(null);
  const [updating, setUpdating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [createSkills, setCreateSkills] = useState<Skill[]>([]);
  const [editSkills, setEditSkills] = useState<Skill[]>([]);
  const [createAttachments, setCreateAttachments] = useState<
    Array<{ type: "file" | "url"; value: File | string; name: string }>
  >([]);
  const [editAttachments, setEditAttachments] = useState<
    Array<{ type: "file" | "url"; value: File | string; name: string }>
  >([]);
  const [createContent, setCreateContent] = useState("");
  const [editContent, setEditContent] = useState("");

  // Notification functions
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

  // Fetch CV showcases with filters
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

  // Fetch categories and tags
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

  // Create CV showcase
  const createCVShowcase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      // Add rich text content
      formData.set("content", createContent);

      // Handle tags
      const tagsString = formData.get("tags") as string;
      if (tagsString) {
        formData.delete("tags");
        formData.append("tags", tagsString);
      }

      // Handle skills - filter out empty names
      const validSkills = createSkills.filter(
        (skill) => skill.name.trim() !== "",
      );
      if (validSkills.length > 0) {
        formData.append("skills", JSON.stringify(validSkills));
      }

      // Handle attachments - add files and URLs
      createAttachments.forEach((attachment) => {
        if (attachment.type === "file") {
          formData.append("attachments", attachment.value as File);
        } else {
          formData.append("attachmentUrls", attachment.value as string);
        }
      });

      // Handle CV URL - prepend base URL
      const cvUrlPath = formData.get("cv_url") as string;
      if (cvUrlPath && cvUrlPath.trim()) {
        formData.delete("cv_url");
        const fullCvUrl = `${config.baseUrl}/${cvUrlPath.replace(/^\//, "")}`;
        formData.append("cv_url", fullCvUrl);
      }

      // Handle boolean fields
      const isFeatured = formData.get("isFeatured") === "on";
      formData.delete("isFeatured");
      formData.append("isFeatured", isFeatured.toString());

      const response = await axios.post(
        `${config.baseUrl}/api/cv-showcase`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data) {
        setShowCreateModal(false);
        setCreateSkills([]);
        setCreateAttachments([]);
        setCreateContent("");
        fetchCVShowcases();
        (e.target as HTMLFormElement).reset();
        showNotification("success", "CV showcase created successfully!");
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.response?.data?.error || "Failed to create CV showcase";
      setError(errorMsg);
      showNotification("error", errorMsg);
      console.error("Error creating CV showcase:", err);
    } finally {
      setCreating(false);
    }
  };

  // Skills management for create form
  const addCreateSkill = () => {
    setCreateSkills([...createSkills, { name: "", rating: 3 }]);
  };

  const removeCreateSkill = (index: number) => {
    setCreateSkills(createSkills.filter((_, i) => i !== index));
  };

  const updateCreateSkill = (
    index: number,
    field: keyof Skill,
    value: string | number,
  ) => {
    const updated = [...createSkills];
    updated[index] = { ...updated[index], [field]: value };
    setCreateSkills(updated);
  };

  // Attachments management for create form
  const addCreateAttachmentUrl = () => {
    const url = prompt("Enter attachment URL:");
    if (url && url.trim()) {
      setCreateAttachments([
        ...createAttachments,
        { type: "url", value: url.trim(), name: url.trim() },
      ]);
    }
  };

  const addCreateAttachmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        type: "file" as const,
        value: file,
        name: file.name,
      }));
      setCreateAttachments([...createAttachments, ...newAttachments]);
      e.target.value = ""; // Reset input
    }
  };

  const removeCreateAttachment = (index: number) => {
    setCreateAttachments(createAttachments.filter((_, i) => i !== index));
  };

  // Skills management for edit form
  const addEditSkill = () => {
    setEditSkills([...editSkills, { name: "", rating: 3 }]);
  };

  const removeEditSkill = (index: number) => {
    setEditSkills(editSkills.filter((_, i) => i !== index));
  };

  const updateEditSkill = (
    index: number,
    field: keyof Skill,
    value: string | number,
  ) => {
    const updated = [...editSkills];
    updated[index] = { ...updated[index], [field]: value };
    setEditSkills(updated);
  };

  // Attachments management for edit form
  const addEditAttachmentUrl = () => {
    const url = prompt("Enter attachment URL:");
    if (url && url.trim()) {
      setEditAttachments([
        ...editAttachments,
        { type: "url", value: url.trim(), name: url.trim() },
      ]);
    }
  };

  const addEditAttachmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        type: "file" as const,
        value: file,
        name: file.name,
      }));
      setEditAttachments([...editAttachments, ...newAttachments]);
      e.target.value = ""; // Reset input
    }
  };

  const removeEditAttachment = (index: number) => {
    setEditAttachments(editAttachments.filter((_, i) => i !== index));
  };

  // Edit CV showcase
  const openEditModal = (cv: CVShowcase) => {
    setEditingCV({ ...cv });
    setEditSkills(cv.skills || []);
    setEditContent(cv.content || "");
    // Convert existing attachments to the format we need
    const existingAttachments = (cv.attachments || []).map((att) => ({
      type: "url" as const,
      value: att,
      name: att.split("/").pop() || att,
    }));
    setEditAttachments(existingAttachments);
    setShowEditModal(true);
  };

  const updateCVShowcase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCV) return;

    setUpdating(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      // Add rich text content
      formData.set("content", editContent);

      // Handle tags
      const tagsString = formData.get("tags") as string;
      if (tagsString) {
        formData.delete("tags");
        formData.append("tags", tagsString);
      }

      // Handle skills - filter out empty names
      const validSkills = editSkills.filter(
        (skill) => skill.name.trim() !== "",
      );
      if (validSkills.length > 0) {
        formData.append("skills", JSON.stringify(validSkills));
      }

      // Handle attachments - separate existing URLs, new files, and new URLs
      const existingUrls = editAttachments
        .filter(
          (att) =>
            att.type === "url" &&
            typeof att.value === "string" &&
            !att.value.startsWith("blob:"),
        )
        .map((att) => att.value as string);

      formData.append("existingAttachments", JSON.stringify(existingUrls));

      // Add new files
      editAttachments.forEach((attachment) => {
        if (attachment.type === "file") {
          formData.append("attachments", attachment.value as File);
        } else if (
          typeof attachment.value === "string" &&
          !existingUrls.includes(attachment.value)
        ) {
          formData.append("attachmentUrls", attachment.value);
        }
      });

      // Handle CV URL - prepend base URL
      const cvUrlPath = formData.get("cv_url") as string;
      if (cvUrlPath && cvUrlPath.trim()) {
        formData.delete("cv_url");
        const fullCvUrl = `${config.baseUrl}/${cvUrlPath.replace(/^\//, "")}`;
        formData.append("cv_url", fullCvUrl);
      }

      // Handle boolean fields
      const isFeatured = formData.get("isFeatured") === "on";
      formData.delete("isFeatured");
      formData.append("isFeatured", isFeatured.toString());

      const response = await axios.put(
        `${config.baseUrl}/api/cv-showcase/${editingCV._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data) {
        setShowEditModal(false);
        setEditingCV(null);
        setEditSkills([]);
        setEditAttachments([]);
        setEditContent("");
        fetchCVShowcases();
        showNotification("success", "CV showcase updated successfully!");
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.response?.data?.error || "Failed to update CV showcase";
      setError(errorMsg);
      showNotification("error", errorMsg);
      console.error("Error updating CV showcase:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Delete CV showcase
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
          {/* Search */}
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

          {/* Category Filter */}
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

          {/* Tag Filter */}
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

          {/* Featured Filter */}
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

      {/* Error Message */}
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
            {/* Featured Badge */}
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
              {cv.content}
            </p>

            {/* Quote */}
            {cv.quote && (
              <div className="border-primary/30 mb-4 border-l-4 pl-3">
                <p className="text-text-muted text-sm italic">&ldquo;{cv.quote}&rdquo;</p>
              </div>
            )}

            {/* Skills */}
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

            {/* Meta Info */}
            <div className="mb-4 space-y-1">
              <p className="text-primary text-sm font-medium capitalize">
                {cv.category}
              </p>
              <p className="text-text-muted text-xs">
                {new Date(cv.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Tags */}
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

            {/* CV URL */}
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

            {/* Attachments */}
            {cv.attachments && cv.attachments.length > 0 && (
              <div className="mb-4">
                <p className="text-text-muted text-xs">
                  {cv.attachments.length} attachment(s)
                </p>
              </div>
            )}

            {/* Actions */}
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
                  href={`/${cv.cv_url.split("/").pop()}`}
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

      {/* Empty State */}
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

      {/* Pagination */}
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

      {/* Create CV Showcase Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-fg text-xl font-semibold">
                Create New CV Showcase
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-muted hover:text-fg rounded-md p-1 transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={createCVShowcase} className="space-y-4">
              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  maxLength={200}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Enter CV showcase title"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Content *
                </label>
                <RichTextEditor
                  value={createContent}
                  onChange={(value) => setCreateContent(value)}
                  placeholder="Describe your experience, achievements, and qualifications..."
                  className="min-h-[200px]"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Quote
                </label>
                <input
                  type="text"
                  name="quote"
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="An inspirational quote (optional)"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-fg text-sm font-medium">Skills</label>
                  <button
                    type="button"
                    onClick={addCreateSkill}
                    className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    <IconPlus size={16} />
                    Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {createSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateCreateSkill(index, "name", e.target.value)
                        }
                        className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                        placeholder="Skill name (e.g., JavaScript)"
                      />
                      <select
                        value={skill.rating}
                        onChange={(e) =>
                          updateCreateSkill(
                            index,
                            "rating",
                            parseInt(e.target.value),
                          )
                        }
                        className="bg-secondary/40 border-border text-fg focus:ring-primary/50 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                      >
                        <option value={1}>1 - Beginner</option>
                        <option value={2}>2 - Elementary</option>
                        <option value={3}>3 - Intermediate</option>
                        <option value={4}>4 - Advanced</option>
                        <option value={5}>5 - Expert</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeCreateSkill(index)}
                        className="text-red-600 transition-colors hover:text-red-700"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  ))}
                  {createSkills.length === 0 && (
                    <p className="text-text-muted text-sm italic">
                      No skills added yet. Click &quot;Add Skill&quot; to add one.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="e.g., Software Development"
                  />
                </div>
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="frontend,backend,fullstack (comma-separated)"
                  />
                </div>
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  CV URL Path
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-sm whitespace-nowrap">
                    {config.baseUrl}/
                  </span>
                  <input
                    type="text"
                    name="cv_url"
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="ai-workshop"
                  />
                </div>
                <p className="text-text-muted mt-1 text-xs">
                  Enter just the path (e.g., ai-workshop, my-cv.pdf). Must be
                  unique.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-fg text-sm font-medium">
                    Attachments
                  </label>
                  <div className="flex gap-2">
                    <label className="text-primary hover:text-primary-dark flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors">
                      <IconPlus size={16} />
                      Add File
                      <input
                        type="file"
                        multiple
                        onChange={addCreateAttachmentFile}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addCreateAttachmentUrl}
                      className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <IconPlus size={16} />
                      Add URL
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {createAttachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="bg-secondary/20 flex items-center justify-between rounded-md border border-gray-200 p-2 dark:border-gray-700"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        {attachment.type === "file" ? (
                          <IconFileText
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                        ) : (
                          <IconExternalLink
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                        )}
                        <span className="text-text-secondary truncate text-sm">
                          {attachment.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCreateAttachment(index)}
                        className="flex-shrink-0 text-red-600 hover:text-red-700"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  ))}
                  {createAttachments.length === 0 && (
                    <p className="text-text-muted text-sm italic">
                      No attachments added. Click &quot;Add File&quot; or
                      &quot;Add URL&quot; to add attachments.
                    </p>
                  )}
                </div>
                <p className="text-text-muted mt-2 text-xs">
                  Max 10 attachments total (files or URLs)
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    className="text-primary focus:ring-primary/50 border-border rounded"
                  />
                  <span className="text-fg text-sm">Featured showcase</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-secondary/40 hover:bg-secondary/60 text-fg rounded-md px-4 py-2 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create CV Showcase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit CV Showcase Modal */}
      {showEditModal && editingCV && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowEditModal(false);
            setEditingCV(null);
          }}
        >
          <div
            className="bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-fg text-xl font-semibold">
                Edit CV Showcase
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCV(null);
                }}
                className="text-text-muted hover:text-fg rounded-md p-1 transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={updateCVShowcase} className="space-y-4">
              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  maxLength={200}
                  defaultValue={editingCV.title}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Enter CV showcase title"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Content *
                </label>
                <RichTextEditor
                  value={editContent}
                  onChange={(value) => setEditContent(value)}
                  placeholder="Describe your experience, achievements, and qualifications..."
                  className="min-h-[200px]"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Quote
                </label>
                <input
                  type="text"
                  name="quote"
                  defaultValue={editingCV.quote || ""}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="An inspirational quote (optional)"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-fg text-sm font-medium">Skills</label>
                  <button
                    type="button"
                    onClick={addEditSkill}
                    className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    <IconPlus size={16} />
                    Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {editSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateEditSkill(index, "name", e.target.value)
                        }
                        className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                        placeholder="Skill name (e.g., JavaScript)"
                      />
                      <select
                        value={skill.rating}
                        onChange={(e) =>
                          updateEditSkill(
                            index,
                            "rating",
                            parseInt(e.target.value),
                          )
                        }
                        className="bg-secondary/40 border-border text-fg focus:ring-primary/50 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                      >
                        <option value={1}>1 - Beginner</option>
                        <option value={2}>2 - Elementary</option>
                        <option value={3}>3 - Intermediate</option>
                        <option value={4}>4 - Advanced</option>
                        <option value={5}>5 - Expert</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeEditSkill(index)}
                        className="text-red-600 transition-colors hover:text-red-700"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  ))}
                  {editSkills.length === 0 && (
                    <p className="text-text-muted text-sm italic">
                      No skills added yet. Click &quot;Add Skill&quot; to add one.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    defaultValue={editingCV.category}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="e.g., Software Development"
                  />
                </div>
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingCV.tags.join(",")}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="frontend,backend,fullstack (comma-separated)"
                  />
                </div>
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  CV URL Path
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-sm whitespace-nowrap">
                    {config.baseUrl}/
                  </span>
                  <input
                    type="text"
                    name="cv_url"
                    defaultValue={
                      editingCV.cv_url
                        ? editingCV.cv_url.replace(config.baseUrl + "/", "")
                        : ""
                    }
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="ai-workshop"
                  />
                </div>
                <p className="text-text-muted mt-1 text-xs">
                  Enter just the path (e.g., ai-workshop, my-cv.pdf). Must be
                  unique.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-fg text-sm font-medium">
                    Attachments
                  </label>
                  <div className="flex gap-2">
                    <label className="text-primary hover:text-primary-dark flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors">
                      <IconPlus size={16} />
                      Add File
                      <input
                        type="file"
                        multiple
                        onChange={addEditAttachmentFile}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addEditAttachmentUrl}
                      className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <IconPlus size={16} />
                      Add URL
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {editAttachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="bg-secondary/20 flex items-center justify-between rounded-md border border-gray-200 p-2 dark:border-gray-700"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        {attachment.type === "file" ? (
                          <IconFileText
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                        ) : (
                          <IconExternalLink
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                        )}
                        <span className="text-text-secondary truncate text-sm">
                          {attachment.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEditAttachment(index)}
                        className="flex-shrink-0 text-red-600 hover:text-red-700"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  ))}
                  {editAttachments.length === 0 && (
                    <p className="text-text-muted text-sm italic">
                      No attachments added. Click &quot;Add File&quot; or &quot;Add
                      URL&quot; to add attachments.
                    </p>
                  )}
                </div>
                <p className="text-text-muted mt-2 text-xs">
                  Max 10 attachments total (files or URLs)
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={editingCV.isFeatured}
                    className="text-primary focus:ring-primary/50 border-border rounded"
                  />
                  <span className="text-fg text-sm">Featured showcase</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCV(null);
                  }}
                  className="bg-secondary/40 hover:bg-secondary/60 text-fg rounded-md px-4 py-2 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update CV Showcase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVConfigPage;
