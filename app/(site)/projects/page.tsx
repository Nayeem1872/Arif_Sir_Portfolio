import { metaTexts } from "@/config/metadata";
import ContactCTA from "@/features/projects/sections/contact-cta";
import ProjectRepos from "@/features/projects/sections/repos";
import { getProjects } from "@/lib/queries";
import { getMetadata } from "@/utils/meta";
import { Metadata } from "next";

export const metadata: Metadata = getMetadata({
  title: metaTexts.projects.title,
  description: metaTexts.projects.description,
});

const ProjectPage = async () => {
  try {
    const projects = await getProjects();

    return (
      <div className="relative w-full">
        {/* <GallerySection /> */}
        <ProjectRepos projects={projects} />
        <ContactCTA />
      </div>
    );
  } catch (error) {
    console.error("Error loading projects page:", error);
    return (
      <div className="relative w-full">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg text-gray-600">
            Failed to load projects. Please try again later.
          </p>
        </div>
        <ContactCTA />
      </div>
    );
  }
};

export const revalidate = 60;

export default ProjectPage;
