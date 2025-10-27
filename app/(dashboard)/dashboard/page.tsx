"use client";

import DashboardOverview from "@/features/dashboard/sections/overview";
import RecentActivity from "@/features/dashboard/sections/recent-activity";
import DashboardStats from "@/features/dashboard/sections/stats";
import { getProfile } from "@/lib/queries";
import type { Profile } from "@/types/data";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
        // Set default profile data as fallback
        setProfile({
          name: "User",
          tagline: "Welcome to your dashboard",
          bio: "Profile data will be loaded when the server is available.",
          about: "",
          location: "Location not available",
          email: "",
          resumeURL: "",
          photo: { url: "", label: "", alt: "" },
          socials: {},
          metrics: [
            { label: "Projects", value: "0" },
            { label: "Experience", value: "0" },
            { label: "Skills", value: "0" },
            { label: "Achievements", value: "0" },
          ],
          experience: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-fg text-3xl font-bold">Dashboard</h1>
          <p className="text-text-secondary">
            Welcome back, {profile?.name || "User"}!
          </p>
        </div>
        <div className="text-right">
          <p className="text-text-muted text-sm">{profile?.tagline || ""}</p>
          <p className="text-text-muted text-sm">{profile?.location || ""}</p>
        </div>
      </div>

      {/* Profile Summary Card */}
      {profile && (
        <div className="bg-card border-border rounded-lg border p-6">
          <h2 className="text-fg mb-4 text-xl font-semibold">
            Profile Summary
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {profile.metrics?.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-primary text-2xl font-bold">
                  {metric.value}
                </div>
                <div className="text-text-muted text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="border-border mt-4 border-t pt-4">
            <p className="text-text-secondary">{profile.bio}</p>
          </div>
        </div>
      )}

      <DashboardStats />
      <DashboardOverview />
      <RecentActivity />
    </div>
  );
};

export default DashboardPage;
