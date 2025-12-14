"use client";

import { config } from "@/lib/config";
import {
  IconExternalLink,
  IconFileText,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { Attachment, Skill } from "./types";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-secondary/40 border-border h-32 w-full animate-pulse rounded-md border" />
    ),
  },
);

interface CreateCVModalProps {
  onClose: () => void;
  onSuccess: () => void;
  showNotification: (type: "success" | "error", message: string) => void;
}

export default function CreateCVModal({
  onClose,
  onSuccess,
  showNotification,
}: CreateCVModalProps) {
  const [creating, setCreating] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [content, setContent] = useState("");

  const addSkill = () => {
    setSkills([...skills, { name: "", rating: 3 }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (
    index: number,
    field: keyof Skill,
    value: string | number,
  ) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const addAttachmentUrl = () => {
    const url = prompt("Enter attachment URL:");
    if (url && url.trim()) {
      setAttachments([
        ...attachments,
        { type: "url", value: url.trim(), name: url.trim() },
      ]);
    }
  };

  const addAttachmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        type: "file" as const,
        value: file,
        name: file.name,
      }));
      setAttachments([...attachments, ...newAttachments]);
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("content", content);

      const tagsString = formData.get("tags") as string;
      if (tagsString) {
        formData.delete("tags");
        formData.append("tags", tagsString);
      }

      const validSkills = skills.filter((skill) => skill.name.trim() !== "");
      if (validSkills.length > 0) {
        formData.append("skills", JSON.stringify(validSkills));
      }

      attachments.forEach((attachment) => {
        if (attachment.type === "file") {
          formData.append("attachments", attachment.value as File);
        } else {
          formData.append("attachmentUrls", attachment.value as string);
        }
      });

      const cvUrlPath = formData.get("cv_url") as string;
      if (cvUrlPath && cvUrlPath.trim()) {
        formData.delete("cv_url");
        const fullCvUrl = `${config.baseUrl}/${cvUrlPath.replace(/^\//, "")}`;
        formData.append("cv_url", fullCvUrl);
      }

      const isFeatured = formData.get("isFeatured") === "on";
      formData.delete("isFeatured");
      formData.append("isFeatured", isFeatured.toString());

      const response = await axios.post(
        `${config.baseUrl}/api/cv-showcase`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data) {
        showNotification("success", "CV showcase created successfully!");
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMsg =
        error?.response?.data?.error || "Failed to create CV showcase";
      showNotification("error", errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
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
            onClick={onClose}
            className="text-text-muted hover:text-fg rounded-md p-1 transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={content}
              onChange={setContent}
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
                onClick={addSkill}
                className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <IconPlus size={16} />
                Add Skill
              </button>
            </div>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, "name", e.target.value)}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    placeholder="Skill name (e.g., JavaScript)"
                  />
                  <select
                    value={skill.rating}
                    onChange={(e) =>
                      updateSkill(index, "rating", parseInt(e.target.value))
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
                    onClick={() => removeSkill(index)}
                    className="text-red-600 transition-colors hover:text-red-700"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
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
              <label className="text-fg text-sm font-medium">Attachments</label>
              <div className="flex gap-2">
                <label className="text-primary hover:text-primary-dark flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors">
                  <IconPlus size={16} />
                  Add File
                  <input
                    type="file"
                    multiple
                    onChange={addAttachmentFile}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={addAttachmentUrl}
                  className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  <IconPlus size={16} />
                  Add URL
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {attachments.map((attachment, index) => (
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
                    onClick={() => removeAttachment(index)}
                    className="flex-shrink-0 text-red-600 hover:text-red-700"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
              {attachments.length === 0 && (
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
                className="text-primary focus:ring-primary/50 border-border rounded"
              />
              <span className="text-fg text-sm">Featured showcase</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
}
