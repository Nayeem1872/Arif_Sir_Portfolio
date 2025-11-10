"use client";

import { getProfile } from "@/lib/queries";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
} from "@tabler/icons-react";
import { Variants, motion } from "framer-motion";
import { useEffect, useState } from "react";

const variants: Variants = {
  hidden: {
    x: "100%",
    opacity: 0,
    rotate: 80,
  },
  show: {
    x: 0,
    opacity: 1,
    rotate: 0,
  },
};

const SocialButton = ({
  href,
  icon: Icon,
  title,
}: {
  href?: string;
  icon: React.ComponentType;
  title: string;
}) => {
  if (!href) {
    return null;
  }

  return (
    <motion.div
      variants={variants}
      transition={{ type: "spring", stiffness: 120, bounce: 0.5 }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        aria-label={title}
        className="social-icon"
      >
        <Icon />
      </a>
    </motion.div>
  );
};

const Socials = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile();
      setProfile(profileData);
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="flex w-full flex-wrap items-center justify-center gap-4">Loading...</div>;
  }

  return (
    <motion.div
      variants={{
        show: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      className="flex w-full flex-wrap items-center justify-center gap-4"
    >
      <SocialButton
        href={profile?.socials?.github ?? undefined}
        title="GitHub"
        icon={IconBrandGithub}
      />
      <SocialButton
        href={profile?.socials?.linkedin ?? undefined}
        title="LinkedIn"
        icon={IconBrandLinkedin}
      />
      <SocialButton
        href={`mailto:${profile?.socials?.email}`}
        title="Email"
        icon={IconMail}
      />
      <SocialButton
        href={profile?.socials?.facebook ?? undefined}
        title="Facebook"
        icon={IconBrandFacebook}
      />
      <SocialButton
        href={profile?.socials?.twitter ?? undefined}
        title="Twitter"
        icon={IconBrandX}
      />
    </motion.div>
  );
};

export default Socials;
