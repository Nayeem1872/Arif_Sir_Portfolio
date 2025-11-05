import type { Profile } from "@/types/data";

export const profileData: Profile = {
  name: "Arif Rahim",
  tagline: "Software Engineer & DevOps Specialist",
  bio: "Expert software engineer specializing in systems programming, enterprise applications, and modern DevOps practices.",
  about:
    "I'm a dedicated software engineer with over 5 years of experience in systems programming and DevOps. I specialize in C/C++, Java, and cloud infrastructure, with a passion for building high-performance, scalable systems and automating deployment processes.",
  location: "Dhaka, Bangladesh",
  email: "arif.rahim@example.com",
  resumeURL: "/resume.pdf",
  photo: {
    url: "/profile-photo.jpg",
    label: "Profile Photo",
    alt: "Arif Rahim - Software Engineer & DevOps Specialist",
  },
  socials: {
    linkedin: "https://www.linkedin.com/in/arifrahim",
    github: "https://github.com/arifrahim",
    email: "arif.rahim@example.com",
    facebook: "https://www.facebook.com/arifrahim",
    twitter: "https://twitter.com/arifrahim",
  },
  metrics: [
    { label: "Years Experience", value: "5+" },
    { label: "Projects Delivered", value: "40+" },
    { label: "Technologies Mastered", value: "15+" },
    { label: "Systems Deployed", value: "25+" },
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Solutions Ltd",
      duration: "2022 - Present",
      description:
        "Leading backend development with C++ and Java, implementing CI/CD pipelines and managing cloud infrastructure on AWS and Azure",
    },
    {
      title: "DevOps Engineer",
      company: "CloudTech Systems",
      duration: "2021 - 2022",
      description:
        "Automated deployment processes using Docker and Kubernetes, managed cloud infrastructure, and optimized system performance",
    },
    {
      title: "Software Developer",
      company: "Innovation Hub",
      duration: "2019 - 2021",
      description:
        "Developed high-performance applications in C/C++ and Java, focusing on system optimization and enterprise solutions",
    },
  ],
};
