"use client";

import { config } from "@/lib/config";
import React, { useState } from "react";

interface CV {
  name: string;
  updatedAt: string;
  url?: string;
}

const CVConfigSettings = () => {
  const [currentCV, setCurrentCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cvName, setCvName] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file"); // "file" or "url"

  // Fetch current CV
  const fetchCurrentCV = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/cv`);
      if (response.ok) {
        const data = await response.json();
        setCurrentCV(data);
        setCvName(data.name || "");
      } else if (response.status === 404) {
        setCurrentCV(null);
      } else {
        if (handleAuthError(response)) return;
        setError("Failed to fetch current CV");
      }
    } catch (err) {
      console.error("Error fetching CV:", err);
      setError("Failed to fetch current CV");
    } finally {
      setLoading(false);
    }
  };

  // Upload CV file
  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (!formData.get("cv") || !formData.get("name")) {
      setError("Please provide both name and CV file");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await fetch(`${config.apiBaseUrl}/cv/upload`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setSuccess("CV uploaded successfully!");
        fetchCurrentCV();
        (e.target as HTMLFormElement).reset();
        setCvName("");
      } else {
        if (handleAuthError(response)) return;
        setError("Failed to upload CV");
      }
    } catch (err) {
      console.error("Error uploading CV:", err);
      setError("Failed to upload CV");
    } finally {
      setLoading(false);
    }
  };

  // Update CV with URL
  const handleUrlUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cvName || !cvUrl) {
      setError("Please provide both name and URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await fetch(`${config.apiBaseUrl}/cv/url`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cvName, url: cvUrl }),
      });

      if (response.ok) {
        setSuccess("CV URL updated successfully!");
        fetchCurrentCV();
        setCvName("");
        setCvUrl("");
      } else {
        if (handleAuthError(response)) return;
        setError("Failed to update CV URL");
      }
    } catch (err) {
      console.error("Error updating CV URL:", err);
      setError("Failed to update CV URL");
    } finally {
      setLoading(false);
    }
  };

  // Download CV
  const handleDownload = () => {
    window.open(`${config.apiBaseUrl}/cv/download`, "_blank");
  };

  // Load current CV on component mount
  React.useEffect(() => {
    fetchCurrentCV();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-fg text-xl font-semibold">CV Management</h2>
        <p className="text-text-secondary text-sm">
          Upload your CV file or provide a URL to your CV (Google Drive,
          Dropbox, etc.)
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
          {success}
        </div>
      )}

      {/* Current CV Status */}
      <div className="bg-secondary/20 rounded-lg p-4">
        <h3 className="text-fg mb-4 text-lg font-medium">Current CV</h3>
        {loading ? (
          <p className="text-text-muted">Loading...</p>
        ) : currentCV ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fg font-medium">{currentCV.name}</p>
              <p className="text-text-secondary text-sm">
                Last updated:{" "}
                {new Date(currentCV.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors"
            >
              Download CV
            </button>
          </div>
        ) : (
          <p className="text-text-muted">No CV uploaded yet</p>
        )}
      </div>

      {/* Upload Method Selection */}
      <div className="bg-secondary/20 rounded-lg p-4">
        <h3 className="text-fg mb-4 text-lg font-medium">Upload Method</h3>
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setUploadMethod("file")}
            className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
              uploadMethod === "file"
                ? "bg-primary text-bg"
                : "bg-secondary/40 text-fg hover:bg-secondary/60"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setUploadMethod("url")}
            className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
              uploadMethod === "url"
                ? "bg-primary text-bg"
                : "bg-secondary/40 text-fg hover:bg-secondary/60"
            }`}
          >
            Use URL
          </button>
        </div>

        {uploadMethod === "file" ? (
          /* File Upload Form */
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                CV Name/Title
              </label>
              <input
                type="text"
                name="name"
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="e.g., Arif Rahim - Software Engineer CV"
              />
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                CV File
              </label>
              <input
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx"
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              />
              <p className="text-text-muted mt-1 text-xs">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload CV"}
            </button>
          </form>
        ) : (
          /* URL Form */
          <form onSubmit={handleUrlUpdate} className="space-y-4">
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                CV Name/Title
              </label>
              <input
                type="text"
                value={cvName}
                onChange={(e) => setCvName(e.target.value)}
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="e.g., Arif Rahim - Software Engineer CV"
              />
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                CV URL
              </label>
              <input
                type="url"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-text-muted mt-1 text-xs">
                Use Google Drive, Dropbox, or any direct file URL
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update CV URL"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CVConfigSettings;
