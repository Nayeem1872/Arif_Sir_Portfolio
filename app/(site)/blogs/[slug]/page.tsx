"use client";

import { config } from "@/lib/config";
import type { Blog } from "@/types/data";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconExternalLink,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Use centralized config for API base URL

const BlogDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        // Try different API endpoints
        let response;
        try {
          // First try with slug

          response = await axios.get(`${config.blogApiBaseUrl}/${slug}`);
        } catch {
          // If slug fails, try getting all blogs and find by slug or title
          try {
            const allBlogsResponse = await axios.get(config.blogApiBaseUrl);

            // Handle different response structures
            const blogs =
              allBlogsResponse.data.posts || allBlogsResponse.data || [];

            const foundBlog = blogs.find((blog: Blog) => {
              const titleSlug = blog.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              return (
                blog.slug === slug || blog._id === slug || titleSlug === slug
              );
            });

            if (foundBlog) {
              response = { data: foundBlog };
            } else {
              throw new Error("Blog not found in fallback search");
            }
          } catch (fallbackError) {
            console.error("Fallback search failed:", fallbackError);
            throw new Error("Blog not found");
          }
        }

        setBlog(response.data);
      } catch (err) {
        setError("Blog post not found");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (imagePath: string) => {
    return `${config.baseUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-muted">Loading blog post...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-600">{error}</div>
          <Link
            href="/blogs"
            className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 sm:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/blogs"
            className="text-primary hover:text-primary-dark inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <IconArrowLeft size={16} />
            Back to Blogs
          </Link>
        </motion.div>

        {/* Featured Badge */}
        {blog.isFeatured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <span className="bg-primary text-bg rounded-full px-3 py-1 text-sm font-semibold">
              Featured Post
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-fg mb-6 text-4xl leading-tight font-bold md:text-5xl"
        >
          {blog.title}
        </motion.h1>

        {/* Meta Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-fg/60 mb-8 flex flex-wrap items-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <IconUser size={16} />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCalendar size={16} />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconClock size={16} />
            <span>5 min read</span>
          </div>
          <div className="bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-medium">
            {blog.category}
          </div>
        </motion.div>

        {/* Featured Image */}
        {blog.images && blog.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 overflow-hidden rounded-xl"
          >
            <Image
              src={getImageUrl(blog.images[0])}
              alt={blog.title}
              width={800}
              height={400}
              className="h-64 w-full object-cover md:h-96"
            />
          </motion.div>
        )}

        {/* Content */}
        {blog.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <div
              className="text-fg prose prose-lg max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <style jsx global>{`
              .prose h1,
              .prose h2,
              .prose h3,
              .prose h4,
              .prose h5,
              .prose h6 {
                color: rgb(248 250 252);
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              .prose p {
                color: rgb(203 213 225);
                margin-bottom: 1.5rem;
                line-height: 1.75;
              }
              .prose a {
                color: rgb(96 165 250);
                text-decoration: underline;
              }
              .prose a:hover {
                color: rgb(147 197 253);
              }
              .prose strong {
                color: rgb(248 250 252);
                font-weight: 600;
              }
              .prose em {
                color: rgb(226 232 240);
              }
              .prose ul,
              .prose ol {
                color: rgb(203 213 225);
                margin: 1.5rem 0;
              }
              .prose li {
                margin: 0.5rem 0;
              }
              .prose blockquote {
                border-left: 4px solid rgb(59 130 246);
                padding-left: 1rem;
                margin: 2rem 0;
                color: rgb(203 213 225);
                font-style: italic;
              }
              .prose code {
                background: rgb(30 41 59);
                color: rgb(226 232 240);
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
              }
              .prose pre {
                background: rgb(15 23 42);
                color: rgb(226 232 240);
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1.5rem 0;
              }
            `}</style>
          </motion.div>
        )}

        {/* Source Code Link */}
        {blog.sourceCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-primary/20 mb-8 border-t pt-6"
          >
            <h3 className="text-fg mb-3 text-lg font-semibold">Source Code</h3>
            <a
              href={blog.sourceCode}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 inline-flex items-center gap-2 rounded-lg border px-4 py-3 font-medium transition-all duration-200 hover:scale-105"
            >
              <IconExternalLink size={20} />
              View Source Code
            </a>
          </motion.div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="border-primary/20 mb-8 border-t pt-6"
          >
            <h3 className="text-fg mb-3 text-lg font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Images */}
        {blog.images && blog.images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="border-primary/20 mb-8 border-t pt-6"
          >
            <h3 className="text-fg mb-4 text-lg font-semibold">Gallery</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {blog.images.slice(1).map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(image)}
                    alt={`${blog.title} - Image ${index + 2}`}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Blogs CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center"
        >
          <Link
            href="/blogs"
            className="bg-primary hover:bg-primary-dark text-bg inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors"
          >
            <IconArrowLeft size={16} />
            Read More Articles
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
