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
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Interfaces for data structure
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

const CVShowcasePage = () => {
  const params = useParams();
  const cvPath = params.cvPath as string;
  const [cvData, setCvData] = useState<CVShowcase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);
        // Assuming cvPath is the unique part of the URL
        const fullCvUrl = `${config.baseUrl}/${cvPath}`;

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

    if (cvPath) {
      fetchCVData();
    }
  }, [cvPath]);

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
      {/* Background Gradient Elements */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="bg-primary/10 absolute -top-80 -right-80 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl" />
        <div className="bg-primary/15 absolute -bottom-80 -left-80 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Featured Badge */}
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

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="from-fg to-fg/70 mb-6 bg-gradient-to-br bg-clip-text text-4xl leading-tight font-extrabold text-transparent md:text-6xl"
        >
          {cvData.title}
        </motion.h1>

        {/* Meta Information */}
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-3">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Quote Section */}
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

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-fg text-3xl font-bold">About</h2>
              {/* Enhanced content rendering with proper Quill HTML support */}
              <div
                className="prose prose-lg prose-invert text-fg/80 prose-headings:text-fg prose-headings:font-semibold prose-p:text-fg/80 prose-p:leading-relaxed prose-a:text-primary prose-a:transition-colors hover:prose-a:text-primary-dark prose-strong:text-fg/90 prose-strong:font-semibold prose-em:text-fg/85 prose-em:italic prose-blockquote:border-primary/50 prose-blockquote:text-fg/70 prose-img:rounded-lg prose-img:shadow-md prose-img:max-w-full prose-img:h-auto prose-ol:text-fg/80 prose-ol:list-decimal prose-ol:pl-6 prose-ul:text-fg/80 prose-ul:list-disc prose-ul:pl-6 prose-li:text-fg/80 prose-li:mb-2 prose-li:leading-relaxed prose-code:bg-gray-800 prose-code:text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto [&_li]:text-fg/80 [&_h1]:text-fg [&_h2]:text-fg [&_h3]:text-fg max-w-none [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-medium [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md [&_li]:leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: cvData.content }}
              />
            </motion.div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Copy URL Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button
                  onClick={copyToClipboard}
                  className="bg-primary hover:bg-primary-dark group text-bg shadow-primary/20 hover:shadow-primary/30 relative flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
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

              {/* Sidebar Cards */}
              {[
                {
                  type: "skills",
                  data: cvData.skills,
                  title: "Skills & Expertise",
                },
                {
                  type: "attachments",
                  data: cvData.attachments,
                  title: "Attachments & Resources",
                },
                { type: "tags", data: cvData.tags, title: "Tags" },
              ].map(
                (section, index) =>
                  section.data &&
                  section.data.length > 0 && (
                    <motion.div
                      key={section.type}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.15 }}
                      className="rounded-xl border border-white/10 bg-gray-500/5 p-6 shadow-lg backdrop-blur-xl"
                    >
                      <h3 className="text-fg mb-4 text-xl font-bold">
                        {section.title}
                      </h3>

                      {section.type === "skills" && (
                        <div className="space-y-4">
                          {cvData.skills.map((skill, skillIndex) => (
                            <div key={skillIndex}>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-fg font-medium">
                                  {skill.name}
                                </span>
                                <span className="text-fg/60">
                                  {skill.rating}/5
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${(skill.rating / 5) * 100}%`,
                                    }}
                                    transition={{
                                      duration: 1,
                                      delay: 0.9 + skillIndex * 0.1,
                                      ease: "easeOut",
                                    }}
                                    className="bg-primary h-full rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === "attachments" && (
                        <div className="space-y-3">
                          {cvData.attachments.map((attachment, attachIndex) => {
                            const isUrl = attachment.startsWith("http");
                            const fileName = isUrl
                              ? new URL(attachment).hostname
                              : attachment.split("/").pop();
                            const fullUrl = isUrl
                              ? attachment
                              : `${config.baseUrl}${attachment}`;
                            return (
                              <motion.a
                                key={attachIndex}
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary/10 hover:bg-primary/20 border-primary/30 group text-primary flex items-center gap-3 rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200"
                              >
                                <IconExternalLink
                                  size={16}
                                  className="flex-shrink-0"
                                />
                                <span className="truncate">{fileName}</span>
                              </motion.a>
                            );
                          })}
                        </div>
                      )}

                      {section.type === "tags" && (
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
                      )}
                    </motion.div>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVShowcasePage;
