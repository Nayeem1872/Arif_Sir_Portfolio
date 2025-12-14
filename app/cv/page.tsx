"use client";

import { config } from "@/lib/config";
import {
  IconAlertTriangle,
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconLoader2,
  IconStar,
} from "@tabler/icons-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

function CVShowcaseContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [cvData, setCvData] = useState<CVShowcase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCVData = async () => {
      if (!slug) {
        setError("No CV path specified");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fullCvUrl = `${config.baseUrl}/${slug}`;

        const response = await axios.get(
          `${config.baseUrl}/api/cv-showcase?limit=100`,
        );

        const showcases = response.data.cvShowcases || [];
        const matchingCV = showcases.find(
          (cv: CVShowcase) => cv.cv_url === fullCvUrl,
        );

        if (matchingCV) {
          setCvData(matchingCV);
        } else {
          setError("CV showcase not found");
        }
      } catch (err) {
        console.error("Error fetching CV data:", err);
        setError("Failed to load CV showcase");
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-bg text-fg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <IconLoader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="text-text-muted">Loading CV Showcase...</p>
        </div>
      </div>
    );
  }

  if (error || !cvData) {
    return (
      <div className="bg-bg text-fg flex min-h-screen items-center justify-center p-4">
        <div className="bg-primary/5 border-primary/20 flex w-full max-w-md flex-col items-center gap-4 rounded-xl border p-8 text-center">
          <IconAlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold">An Error Occurred</h2>
          <p className="text-red-400">
            {error ||
              "CV showcase not found. Please check the URL and try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg text-fg min-h-screen py-20 sm:py-24">
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="bg-primary/10 absolute -top-80 -right-80 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl" />
        <div className="bg-primary/15 absolute -bottom-80 -left-80 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {cvData.isFeatured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <span className="bg-primary text-bg shadow-primary/20 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-lg">
              <IconStar size={16} fill="currentColor" />
              Featured CV
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="from-fg to-fg/70 mb-6 bg-gradient-to-br bg-clip-text text-4xl leading-tight font-extrabold text-transparent md:text-6xl"
        >
          {cvData.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-fg/70 mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-base"
        >
          <div className="flex items-center gap-2">
            <IconBriefcase size={18} />
            <span>{cvData.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCalendar size={18} />
            <span>Updated on {formatDate(cvData.updatedAt)}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {cvData.quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <blockquote className="bg-primary/5 border-primary/40 relative rounded-xl border-l-4 p-6 shadow-lg">
                  <p className="text-fg/90 text-xl leading-relaxed font-medium italic md:text-2xl">
                    &ldquo;{cvData.quote}&rdquo;
                  </p>
                </blockquote>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-fg text-3xl font-bold">About</h2>
              <div
                className="prose prose-lg prose-invert text-fg/80 max-w-none"
                dangerouslySetInnerHTML={{ __html: cvData.content }}
              />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button
                  onClick={copyToClipboard}
                  className="bg-primary hover:bg-primary-dark group text-bg shadow-primary/20 relative flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 font-semibold shadow-lg transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-3"
                      >
                        <IconCheck size={20} />
                        Copied!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-3"
                      >
                        <IconCopy size={20} />
                        Copy URL
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>

              {cvData.skills && cvData.skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="rounded-xl border border-white/10 bg-gray-500/5 p-6 shadow-lg backdrop-blur-xl"
                >
                  <h3 className="text-fg mb-4 text-xl font-bold">
                    Skills & Expertise
                  </h3>
                  <div className="space-y-4">
                    {cvData.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-fg font-medium">
                            {skill.name}
                          </span>
                          <span className="text-fg/60">{skill.rating}/5</span>
                        </div>
                        <div className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(skill.rating / 5) * 100}%` }}
                            transition={{
                              duration: 1,
                              delay: 0.9 + skillIndex * 0.1,
                            }}
                            className="bg-primary h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {cvData.attachments && cvData.attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.85 }}
                  className="rounded-xl border border-white/10 bg-gray-500/5 p-6 shadow-lg backdrop-blur-xl"
                >
                  <h3 className="text-fg mb-4 text-xl font-bold">
                    Attachments
                  </h3>
                  <div className="space-y-3">
                    {cvData.attachments.map((attachment, index) => {
                      const isUrl = attachment.startsWith("http");
                      const fileName = isUrl
                        ? new URL(attachment).hostname
                        : attachment.split("/").pop();
                      const fullUrl = isUrl
                        ? attachment
                        : `${config.baseUrl}${attachment}`;
                      return (
                        <a
                          key={index}
                          href={fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary flex items-center gap-3 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                        >
                          <IconExternalLink size={16} />
                          <span className="truncate">{fileName}</span>
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {cvData.tags && cvData.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="rounded-xl border border-white/10 bg-gray-500/5 p-6 shadow-lg backdrop-blur-xl"
                >
                  <h3 className="text-fg mb-4 text-xl font-bold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {cvData.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CVShowcasePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bg text-fg flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <IconLoader2 className="text-primary h-10 w-10 animate-spin" />
            <p className="text-text-muted">Loading CV Showcase...</p>
          </div>
        </div>
      }
    >
      <CVShowcaseContent />
    </Suspense>
  );
}
