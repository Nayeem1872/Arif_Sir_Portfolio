"use client";

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

interface Blog {
  _id: string;
  title: string;
  content?: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  isFeatured: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BLOG_API_BASE_URL || "http://localhost:8000/api/blog";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<boolean | null>(null);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [updating, setUpdating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Notification functions
  const showNotification = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message };
    setNotifications((prev) => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch blogs with filters
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      params.append("page", currentPage.toString());
      params.append("limit", "12");

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedTag) params.append("tag", selectedTag);
      if (publishedFilter !== null)
        params.append("published", publishedFilter.toString());
      if (featuredFilter !== null)
        params.append("isFeatured", featuredFilter.toString());

      const response = await axios.get(
        `${API_BASE_URL}?${params}&includeContent=true`,
      );
      setBlogs(response.data.posts || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    selectedTag,
    publishedFilter,
    featuredFilter,
  ]);

  // Fetch categories and tags
  const fetchFilters = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories/all`),
        axios.get(`${API_BASE_URL}/tags/all`),
      ]);

      setCategories(categoriesRes.data.categories || categoriesRes.data || []);
      setTags(tagsRes.data.tags || tagsRes.data || []);
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  };

  // Create blog
  const createBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      // Handle tags - convert comma-separated string to array
      const tagsString = formData.get("tags") as string;
      if (tagsString) {
        formData.delete("tags");
        formData.append("tags", tagsString);
      }

      // Handle boolean fields - convert checkbox values to proper booleans
      const published = formData.get("published") === "on";
      const isFeatured = formData.get("isFeatured") === "on";

      formData.delete("published");
      formData.delete("isFeatured");
      formData.append("published", published.toString());
      formData.append("isFeatured", isFeatured.toString());

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if creation was successful (adjust based on your API response)
      if (response.data) {
        setShowCreateModal(false);
        fetchBlogs(); // Refresh the list
        // Reset form
        (e.target as HTMLFormElement).reset();
        showNotification("success", "Blog post created successfully!");
      }
    } catch (err) {
      setError("Failed to create blog post");
      showNotification("error", "Failed to create blog post");
      console.error("Error creating blog:", err);
    } finally {
      setCreating(false);
    }
  };

  // Edit blog
  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setShowEditModal(true);
  };

  const updateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBlog) return;

    setUpdating(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      // Handle tags - convert comma-separated string to array
      const tagsString = formData.get("tags") as string;
      if (tagsString) {
        formData.delete("tags");
        formData.append("tags", tagsString);
      }

      // Handle boolean fields - convert checkbox values to proper booleans
      const published = formData.get("published") === "on";
      const isFeatured = formData.get("isFeatured") === "on";

      formData.delete("published");
      formData.delete("isFeatured");
      formData.append("published", published.toString());
      formData.append("isFeatured", isFeatured.toString());

      const response = await axios.put(
        `${API_BASE_URL}/${editingBlog._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data) {
        setShowEditModal(false);
        setEditingBlog(null);
        fetchBlogs(); // Refresh the list
        showNotification("success", "Blog post updated successfully!");
      }
    } catch (err) {
      setError("Failed to update blog post");
      showNotification("error", "Failed to update blog post");
      console.error("Error updating blog:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Delete blog
  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchBlogs(); // Refresh the list
      showNotification("success", "Blog post deleted successfully!");
    } catch (err) {
      setError("Failed to delete blog");
      showNotification("error", "Failed to delete blog post");
      console.error("Error deleting blog:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    fetchFilters();
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedTag("");
    setPublishedFilter(null);
    setFeaturedFilter(null);
    setCurrentPage(1);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading blogs...</div>
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
        <h1 className="text-fg text-3xl font-bold">Blog Posts</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary-dark text-bg flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors"
        >
          <IconPlus size={20} />
          Add Blog Post
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative">
            <IconSearch
              size={16}
              className="text-text-muted absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Search blogs..."
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

          {/* Published Filter */}
          <select
            value={publishedFilter === null ? "" : publishedFilter.toString()}
            onChange={(e) =>
              setPublishedFilter(
                e.target.value === "" ? null : e.target.value === "true",
              )
            }
            className="bg-secondary/40 border-border text-fg focus:ring-primary/50 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
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
            <option value="">All Posts</option>
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

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-card border-border hover:border-primary/30 relative overflow-hidden rounded-xl border p-0 transition-all duration-200 hover:shadow-lg"
          >
            {/* Featured Badge */}
            {blog.isFeatured && (
              <div className="absolute top-3 right-3 z-10">
                <div className="rounded-full bg-yellow-500 p-1.5 text-white shadow-md">
                  <IconStar size={14} fill="currentColor" />
                </div>
              </div>
            )}

            {/* Blog Image */}
            {blog.images && blog.images.length > 0 && (
              <div className="relative h-48 w-full">
                <img
                  src={`http://localhost:8000${blog.images[0]}`}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            <div className="p-6">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-fg line-clamp-2 text-lg leading-tight font-semibold">
                  {blog.title}
                </h3>
                <span
                  className={`ml-2 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                    blog.isFeatured
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}
                >
                  Featured: {blog.isFeatured ? "True" : "False"}
                </span>
              </div>

              <p className="text-text-secondary mb-4 line-clamp-2 text-sm leading-relaxed">
                {blog.excerpt}
              </p>

              {/* Meta Info */}
              <div className="mb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-text-muted text-xs">By {blog.author}</p>
                  <p className="text-text-muted text-xs">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-primary text-sm font-medium capitalize">
                  {blog.category}
                </p>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-text-muted self-center text-xs">
                      +{blog.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(blog)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <IconEdit size={16} className="mr-1.5 inline" />
                  Edit
                </button>
                <button className="border-border hover:border-primary/50 text-text-secondary hover:text-primary rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
                  <IconExternalLink size={16} />
                </button>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:scale-105 hover:border-red-300 hover:text-red-700"
                >
                  <IconTrash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-text-muted mb-4">No blog posts found</div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors"
          >
            Create your first blog post
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

      {/* Create Blog Modal */}
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
                Create New Blog Post
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-muted hover:text-fg rounded-md p-1 transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={createBlog} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Enter blog title"
                  />
                </div>
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Author name"
                  />
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
                    placeholder="e.g., Tutorial, News, Guide"
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
                    placeholder="javascript,nodejs,tutorial (comma-separated)"
                  />
                </div>
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Brief description of the blog post"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Content *
                </label>
                <textarea
                  name="content"
                  required
                  rows={8}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Write your blog content here..."
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Images
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                />
                <p className="text-text-muted mt-1 text-xs">
                  Max 10 files, 5MB each. Supported: JPG, PNG, GIF
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    className="text-primary focus:ring-primary/50 border-border rounded"
                  />
                  <span className="text-fg text-sm">Publish immediately</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    className="text-primary focus:ring-primary/50 border-border rounded"
                  />
                  <span className="text-fg text-sm">Featured post</span>
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
                  {creating ? "Creating..." : "Create Blog Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditModal && editingBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowEditModal(false);
            setEditingBlog(null);
          }}
        >
          <div
            className="bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-fg text-xl font-semibold">Edit Blog Post</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBlog(null);
                }}
                className="text-text-muted hover:text-fg rounded-md p-1 transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={updateBlog} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingBlog.title}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Enter blog title"
                  />
                </div>
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    defaultValue={editingBlog.author}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Author name"
                  />
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
                    defaultValue={editingBlog.category}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="e.g., Tutorial, News, Guide"
                  />
                </div>
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingBlog.tags?.join(", ") || ""}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="javascript,nodejs,tutorial (comma-separated)"
                  />
                </div>
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  defaultValue={editingBlog.excerpt}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Brief description of the blog post"
                />
              </div>

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Content *
                </label>
                <textarea
                  name="content"
                  required
                  rows={8}
                  defaultValue={editingBlog.content}
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Write your blog content here..."
                />
              </div>

              {/* Current Images */}
              {editingBlog.images && editingBlog.images.length > 0 && (
                <div>
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Current Images
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editingBlog.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`http://localhost:8000${image}`}
                          alt={`Blog image ${index + 1}`}
                          className="h-20 w-20 rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Add logic to remove image
                            const updatedImages = editingBlog.images.filter(
                              (_, i) => i !== index,
                            );
                            setEditingBlog({
                              ...editingBlog,
                              images: updatedImages,
                            });
                          }}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <IconX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-fg mb-2 block text-sm font-medium">
                  Add New Images
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                />
                <p className="text-text-muted mt-1 text-xs">
                  Max 10 files, 5MB each. Supported: JPG, PNG, GIF
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editingBlog.published}
                    className="text-primary focus:ring-primary/50 border-border rounded"
                  />
                  <span className="text-fg text-sm">Published</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={editingBlog.isFeatured}
                    className="text-primary focus:ring-primary/50 border-border rounded"
                  />
                  <span className="text-fg text-sm">Featured post</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBlog(null);
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
                  {updating ? "Updating..." : "Update Blog Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
