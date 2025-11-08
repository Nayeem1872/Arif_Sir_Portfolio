"use client";

import { homepage } from "@/config/content/pages";

import type { Blog } from "@/types/data";
import { IconTrendingUp } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import BlogCard from "../components/blog-card";

interface BlogSectionProps {
  blogs: Blog[];
  className?: string;
}

const BlogSection = ({ blogs, className }: BlogSectionProps) => {
  const router = useRouter();

  const handlePostClick = (blog: Blog) => {
    const slug =
      blog.slug ||
      blog._id ||
      blog.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    router.push(`/blogs/${slug}`);
  };

  const handleBlogsClick = () => {
    router.push("/blogs");
  };

  return (
    <section
      className={`relative mx-auto my-16 max-w-[1300px] px-4 py-8 ${className || ""}`}
    >
      <h1 className="mb-2 text-center text-3xl !leading-[1.4] font-semibold capitalize md:text-4xl lg:text-5xl">
        {homepage.blogHeading || "Our Most Popular Articles of 2024!"}
      </h1>

      <span className="text-foreground/[0.025] absolute -top-8 -left-[15%] -z-50 text-[120px] leading-[1] font-extrabold text-black/[0.03] select-none md:text-[180px] lg:text-[280px]">
        BLOG
      </span>

      <p className="text-foreground/50 mx-auto mb-6 max-w-[700px] text-center text-lg !leading-[1.8] md:text-xl">
        Discover the most engaging content from our amazing community of
        developers and designers
      </p>

      <div className="mb-6 grid h-auto grid-cols-1 gap-4 md:h-[500px] md:grid-cols-2 lg:grid-cols-[1fr_0.5fr]">
        {blogs.slice(0, 3).map((blog, index) => {
          const isPrimary = index === 0;
          return (
            <BlogCard
              key={blog._id}
              blog={blog}
              isPrimary={isPrimary}
              onPostClick={handlePostClick}
            />
          );
        })}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <button
          onClick={handleBlogsClick}
          className="outline-button group mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 transition-all duration-200 hover:scale-105"
          type="button"
        >
          <IconTrendingUp className="transition-transform group-hover:scale-110" />
          <span>{homepage.blogCta || "View All Blogs"}</span>
        </button>
      </div>
    </section>
  );
};

export default BlogSection;
