"use client";

import type { Blog } from "@/types/data";
import {
  IconArrowUpRight,
  IconCalendar,
  IconClock,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const [hover, setHover] = useState(false);

  const mouseEnter = () => {
    setHover(true);
  };
  const mouseLeave = () => {
    setHover(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get the image URL with correct base URL for environment
  const getImageUrl = () => {
    if (blog.images && blog.images.length > 0) {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://arif-sir-blog-backend.onrender.com"
          : "http://localhost:8000";
      return `${baseUrl}${blog.images[0]}`;
    }
    // Fallback to legacy image field or default
    return (
      blog.image ||
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
    );
  };

  // Get published date (use createdAt for new API, publishedAt for legacy)
  const getPublishedDate = () => {
    return blog.createdAt || blog.publishedAt || new Date().toISOString();
  };

  // Check if featured (use isFeatured for new API, featured for legacy)
  const isFeatured = blog.isFeatured || blog.featured;

  // Generate slug from title if not available
  const getSlug = () => {
    return (
      blog.slug ||
      blog.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  return (
    <motion.article
      layout
      className="group border-primary/20 bg-secondary/50 hover:border-primary/40 relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300"
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      whileHover={{ y: -4 }}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="bg-primary text-bg absolute top-3 left-3 z-10 rounded-full px-2 py-1 text-xs font-semibold">
          Featured
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-primary/80 text-bg rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm">
            {blog.category}
          </span>
        </div>

        {/* Read More Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.8 }}
          className="absolute top-4 right-4"
        >
          <Link
            href={`/blogs/${getSlug()}`}
            className="bg-primary/80 text-bg hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
          >
            <IconArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Meta Information */}
        <div className="text-fg/60 mb-2 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <IconCalendar size={14} />
            <span>{formatDate(getPublishedDate())}</span>
          </div>
          <div className="flex items-center gap-1">
            <IconClock size={14} />
            <span>{blog.readTime || "5 min read"}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-fg group-hover:text-primary mb-2 line-clamp-2 text-lg font-bold transition-colors">
          <Link href={`/blogs/${getSlug()}`}>{blog.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-fg/70 mb-3 line-clamp-2 text-sm leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {blog.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary rounded px-2 py-1 text-xs"
            >
              #{tag}
            </span>
          ))}
          {blog.tags.length > 2 && (
            <span className="bg-secondary text-fg/60 rounded px-2 py-1 text-xs">
              +{blog.tags.length - 2}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="border-primary/20 flex items-center gap-2 border-t pt-3">
          <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full">
            <IconUser size={14} />
          </div>
          <div className="text-fg/80 flex items-center gap-1 text-xs">
            <span>{blog.author}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
