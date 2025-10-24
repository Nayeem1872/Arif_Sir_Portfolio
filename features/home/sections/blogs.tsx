"use client";

import Heading from "@/components/common/heading";
import { homepage } from "@/config/content/pages";
import type { Blog } from "@/types/data";
import { IconBookmark, IconTrendingUp } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import BlogCard from "../components/blog-card";

const BlogSection = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <section className="relative flex w-full flex-col items-center py-16 sm:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="max-container relative mb-8 px-4 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-badge"
        >
          <IconBookmark className="mr-2" />
          <span>Latest Blogs</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Heading as="h3">{homepage.blogHeading}</Heading>
        </motion.div>
      </div>

      {/* Blog Grid */}
      <div className="inner-container relative mb-4 grid grid-cols-1 gap-6 md:mb-10 md:grid-cols-2 lg:grid-cols-3">
        {blogs.slice(0, 6).map((blog, index) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <BlogCard blog={blog} />
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link href="/blogs">
          <button
            type="button"
            className="outline-button group mt-8 rounded-full"
          >
            <IconTrendingUp className="transition-transform group-hover:scale-110" />
            <span>{homepage.blogCta}</span>
          </button>
        </Link>
      </motion.div>
    </section>
  );
};

export default BlogSection;
