"use client";

import BlogCard from "@/features/home/components/blog-card";
import type { Blog } from "@/types/data";
import {
  IconBookmark,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import axios from "axios";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const BLOG_API_BASE_URL =
  process.env.NEXT_PUBLIC_BLOG_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://arif-sir-blog-backend.onrender.com/api/blog"
    : "http://localhost:8000/api/blog");

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchBlogs = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BLOG_API_BASE_URL}?page=${page}&limit=12&includeContent=true`,
      );

      console.log("All blogs API response:", response.data);

      setBlogs(response.data.posts || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalPosts(response.data.pagination?.totalPosts || 0);
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to fetch blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchBlogs(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-muted">Loading blogs...</div>
      </div>
    );
  }

  if (error && blogs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-600">{error}</div>
          <button
            onClick={() => fetchBlogs(1)}
            className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="section-badge mb-4">
            <IconBookmark className="mr-2" />
            <span>All Blogs</span>
          </div>
          <h1 className="text-fg mb-4 text-4xl font-bold">
            Latest Articles & Insights
          </h1>
          <p className="text-text-secondary mx-auto max-w-2xl text-lg">
            Discover our latest thoughts, tutorials, and insights on technology,
            development, and more.
          </p>
          <div className="text-text-muted mt-2 text-sm">
            {totalPosts} {totalPosts === 1 ? "post" : "posts"} found
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="text-primary hover:text-primary-dark inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <IconChevronLeft size={16} />
            Back to Home
          </Link>
        </motion.div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <>
            <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-2"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-secondary/40 hover:bg-secondary/60 text-fg flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary text-bg"
                            : "bg-secondary/40 hover:bg-secondary/60 text-fg"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-secondary/40 hover:bg-secondary/60 text-fg flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <IconChevronRight size={16} />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-12 text-center"
          >
            <div className="text-text-muted mb-4">No blog posts found</div>
            <Link
              href="/"
              className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
