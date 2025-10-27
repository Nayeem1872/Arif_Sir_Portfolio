"use client";

import AboutMeSection from "@/features/about/sections/about-me";
import ExperienceSection from "@/features/about/sections/experience";
import { getProfile } from "@/lib/queries";
import type { Profile } from "@/types/data";
import { useEffect, useState } from "react";

const AboutPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      {profile && <AboutMeSection profile={profile} />}
      <ExperienceSection />
    </div>
  );
};

export default AboutPage;
