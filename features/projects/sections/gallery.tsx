import Heading from "@/components/common/heading";
import { SectionContainer } from "@/components/layout/section";
import { projectPage } from "@/config/content/pages";
import { getProjects } from "@/lib/queries";
import { IconBriefcase } from "@tabler/icons-react";
import { Suspense } from "react";
import ProjectGrid from "../components/project-grid";

const GallerySection = async () => {
  return (
    <SectionContainer className="lg:pt-10">
      <div className="section-badge">
        <IconBriefcase className="mr-2" />
        <span>Featured Projects</span>
      </div>
      <Heading className="mb-4 px-4 sm:mx-auto sm:mb-8">
        {projectPage.heading}
      </Heading>
      <p className="description px-4 md:mb-10">{projectPage.desc}</p>

      <Suspense
        fallback={
          <div className="flex h-[60vh] items-center justify-center">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
          </div>
        }
      >
        <ProjectGridWrapper />
      </Suspense>
    </SectionContainer>
  );
};

const ProjectGridWrapper = async () => {
  const projects = await getProjects();
  const featuredProjects = projects.slice(0, 6);
  return <ProjectGrid projects={featuredProjects} />;
};

export default GallerySection;
