"use client";

import { getProfile, updateProfile } from "@/lib/queries";
import { Profile } from "@/types/data";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [experiences, setExperiences] = useState<Profile["experience"]>([]);
  const [metrics, setMetrics] = useState<Profile["metrics"]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setExperiences(data.experience || []);
        setMetrics(data.metrics || []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setMessage("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { title: "", company: "", duration: "", description: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp,
    );
    setExperiences(updated);
  };

  const addMetric = () => {
    setMetrics([...metrics, { label: "", value: "" }]);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const updateMetric = (index: number, field: string, value: string) => {
    const updated = metrics.map((metric, i) =>
      i === index ? { ...metric, [field]: value } : metric,
    );
    setMetrics(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      const updatedProfile = {
        name: formData.get("name") as string,
        tagline: formData.get("tagline") as string,
        bio: formData.get("bio") as string,
        about: formData.get("about") as string,
        location: formData.get("location") as string,
        email: formData.get("email") as string,
        socials: {
          ...profile.socials,
          linkedin: formData.get("linkedin") as string,
          github: formData.get("github") as string,
          email: formData.get("email") as string,
          bluesky: formData.get("bluesky") as string,
        },
        experience: experiences,
        metrics: metrics,
      };

      const updated = await updateProfile(updatedProfile);
      setProfile(updated);
      setExperiences(updated.experience || []);
      setMetrics(updated.metrics || []);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-text-muted">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-text-muted">Failed to load profile data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-fg text-3xl font-bold">Profile Settings</h1>
      </div>

      {message && (
        <div
          className={`rounded-md p-4 ${
            message.includes("successfully")
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h2 className="text-fg mb-4 text-xl font-semibold">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.name}
                required
              />
            </div>
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.email}
                required
              />
            </div>
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.tagline}
                required
              />
            </div>
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.location}
                required
              />
            </div>
          </div>
        </div>

        {/* Bio & About */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h2 className="text-fg mb-4 text-xl font-semibold">Bio & About</h2>
          <div className="space-y-4">
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Bio (Short Description)
              </label>
              <textarea
                name="bio"
                rows={3}
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.bio}
                required
              />
            </div>
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                About (Detailed Description)
              </label>
              <textarea
                name="about"
                rows={5}
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.about}
                required
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h2 className="text-fg mb-4 text-xl font-semibold">Social Links</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.socials?.linkedin}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                GitHub
              </label>
              <input
                type="url"
                name="github"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.socials?.github}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                BlueSky
              </label>
              <input
                type="url"
                name="bluesky"
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                defaultValue={profile.socials?.bluesky}
                placeholder="https://bsky.app/profile/username"
              />
            </div>
          </div>
        </div>

        {/* Experience Section - Editable */}
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-fg text-xl font-semibold">Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors"
            >
              <IconPlus className="h-4 w-4" />
              Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="border-border relative rounded-lg border p-4"
              >
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-2 right-2 rounded-md p-1 text-red-500 transition-colors hover:bg-red-50"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-fg mb-2 block text-sm font-medium">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(index, "title", e.target.value)
                      }
                      className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="e.g. Senior Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-fg mb-2 block text-sm font-medium">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="e.g. Tech Solutions Ltd"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-fg mb-2 block text-sm font-medium">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) =>
                        updateExperience(index, "duration", e.target.value)
                      }
                      className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="e.g. 2022 - Present"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-fg mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    rows={3}
                    className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Describe your role and achievements..."
                    required
                  />
                </div>
              </div>
            ))}
            {experiences.length === 0 && (
              <div className="text-text-muted py-8 text-center">
                No experience added yet. Click &quot;Add Experience&quot; to get
                started.
              </div>
            )}
          </div>
        </div>

        {/* Metrics Section - Editable */}
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-fg text-xl font-semibold">Metrics</h2>
            <button
              type="button"
              onClick={addMetric}
              className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors"
            >
              <IconPlus className="h-4 w-4" />
              Add Metric
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="border-border relative rounded-lg border p-4"
              >
                <button
                  type="button"
                  onClick={() => removeMetric(index)}
                  className="absolute top-2 right-2 rounded-md p-1 text-red-500 transition-colors hover:bg-red-50"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
                <div className="space-y-3">
                  <div>
                    <label className="text-fg mb-2 block text-sm font-medium">
                      Label
                    </label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) =>
                        updateMetric(index, "label", e.target.value)
                      }
                      className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="e.g. Years Experience"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-fg mb-2 block text-sm font-medium">
                      Value
                    </label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) =>
                        updateMetric(index, "value", e.target.value)
                      }
                      className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      placeholder="e.g. 5+"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            {metrics.length === 0 && (
              <div className="text-text-muted col-span-full py-8 text-center">
                No metrics added yet. Click &quot;Add Metric&quot; to get
                started.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary-dark text-bg rounded-md px-6 py-2 font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
