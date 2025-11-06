import ProjectImages from "@/features/projects/components/project-image";
import { getProjectDetail, getProjects, getProjectSlugs } from "@/lib/queries";
import { getLanguageColor } from "@/utils/get-language-color";
import { getMetadata } from "@/utils/meta";
import {
  IconArchive,
  IconBrandGithub,
  IconChevronLeft,
  IconCircleDotted,
  IconCode,
  IconExternalLink,
  IconLink,
  IconTag,
  IconWorld,
} from "@tabler/icons-react";
import { Metadata } from "next";
// Removed PortableText import - using simple text rendering
import Link from "next/link";

// Helper function to get full image URL
const getImageUrl = (url: string) => {
  if (url.startsWith("http")) {
    return url; // Already a full URL
  }
  // Add the base URL for relative paths
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com"
      : "http://localhost:8000";
  return `${baseUrl}${url}`;
};

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const slugs = (await getProjectSlugs()) as string[];

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const project = await getProjectDetail({ slug: slugPath });

  if (!project?.name)
    return {
      title: "Project Not Found",
    };

  return getMetadata({
    title: project.name,
    description: project.tagline ?? "",
    image: `/api/og?title=${encodeURIComponent(project.name)}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProjectDetail({ slug });
  const allProjects = await getProjects();

  const otherProjects = allProjects
    .filter((project) => project.slug !== slug)
    .slice(0, 5);

  // Process images with full URLs
  const projectImages =
    data?.screenshots?.map((screenshot) => getImageUrl(screenshot.url)) ?? [];

  const renderStatusIcon = (
    status: "live" | "archived" | "development" | null,
  ) => {
    switch (status) {
      case "live":
        return <IconWorld size={20} className="mr-1 inline-block" />;
      case "archived":
        return <IconArchive size={20} className="mr-1 inline-block" />;
      case "development":
        return <IconCode size={20} className="mr-1 inline-block" />;
      default:
        return <IconCircleDotted size={20} className="mr-1 inline-block" />;
    }
  };

  if (!data)
    return <div className="text-fg text-center">Project not found</div>;

  return (
    <main className="max-container relative px-4">
      <nav className="mb-2 text-sm tracking-wider">
        <Link
          href="/projects"
          className="text-text-secondary flex w-fit items-center gap-1 hover:text-white"
        >
          <IconChevronLeft className="mr-1 inline-block" />
          Projects
        </Link>
      </nav>

      <header className="mb-4">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {data.name}
          </h1>
          <span className="bg-card text-card-fg border-fg/20 inline-block rounded-full border px-3 py-1 text-sm capitalize">
            {renderStatusIcon(data.status)}
            {data.status}
          </span>
        </div>
        <p className="text-secondary-fg/80 tracking-tight md:text-lg lg:text-xl">
          {data.tagline}
        </p>
      </header>

      <div className="border-border mb-10 flex flex-col justify-between gap-4 border-b pb-2 md:flex-row md:items-center md:gap-1">
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary/20 text-primary border-primary/30 rounded-full border px-3 py-1 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          {data.githubURL && (
            <a
              href={data.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-fg/80 hover:text-secondary-fg flex cursor-pointer items-center justify-center gap-1 text-lg transition-colors"
            >
              <IconBrandGithub className="h-4 w-4" />
              GitHub
            </a>
          )}
          {data.liveURL && (
            <a
              href={data.liveURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-fg/80 hover:text-secondary-fg flex cursor-pointer items-center justify-center gap-1 text-lg transition-colors"
            >
              <IconExternalLink className="h-4 w-4" />
              Visit Live
            </a>
          )}
        </div>
      </div>

      <section className="grid grid-cols-12 gap-8">
        <section className="col-span-12 space-y-8 lg:col-span-8">
          {/* Project Images */}
          {projectImages.length > 0 && (
            <div className="relative mb-10">
              <h2 className="border-primary mb-6 border-l-4 pl-4 text-lg font-medium capitalize md:text-xl lg:text-2xl">
                Project Screenshots
              </h2>
              <ProjectImages
                title={data.name ?? "Project Screenshots"}
                images={projectImages}
              />
            </div>
          )}

          {/* Project Description */}
          {data.description && (
            <article className="prose prose-invert text-fg max-w-none lg:text-lg">
              <h2 className="border-primary mb-6 border-l-4 pl-4 text-lg font-medium capitalize md:text-xl lg:text-2xl">
                About This Project
              </h2>
              <div className="bg-secondary/20 rounded-lg p-6">
                {data.description?.map((block, index) => (
                  <p key={index} className="mb-4 leading-relaxed last:mb-0">
                    {block.children?.map((child, childIndex) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </p>
                ))}
              </div>
            </article>
          )}

          {/* Project Features */}
          {data.features && (
            <article className="prose prose-invert text-fg max-w-none lg:text-lg">
              <h2 className="border-primary mb-6 border-l-4 pl-4 text-lg font-medium capitalize md:text-xl lg:text-2xl">
                Key Features
              </h2>
              <div className="bg-secondary/20 rounded-lg p-6">
                <ul className="space-y-3">
                  {data.features?.map((block, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                        ✓
                      </span>
                      <span className="leading-relaxed">
                        {block.children?.map((child, childIndex) => (
                          <span key={childIndex}>{child.text}</span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )}

          {/* Development Process */}
          {data.development && (
            <article className="prose prose-invert text-fg max-w-none lg:text-lg">
              <h2 className="border-primary mb-6 border-l-4 pl-4 text-lg font-medium capitalize md:text-xl lg:text-2xl">
                Development Process
              </h2>
              <div className="bg-secondary/20 rounded-lg p-6">
                {data.development?.map((block, index) => (
                  <p key={index} className="mb-4 leading-relaxed last:mb-0">
                    {block.children?.map((child, childIndex) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </p>
                ))}
              </div>
            </article>
          )}

          {/* Technologies Used */}
          {data.tags && data.tags.length > 0 && (
            <div className="mt-8">
              <h2 className="border-primary mb-6 border-l-4 pl-4 text-lg font-medium capitalize md:text-xl lg:text-2xl">
                Technologies Used
              </h2>
              <div className="bg-secondary/20 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {data.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 border-primary/20 flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                        <span className="text-primary text-sm font-bold">
                          {tag.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-secondary-fg font-medium">
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages (if available) */}
          {data.languages && data.languages.length > 0 && (
            <div className="mt-8">
              <h2 className="border-primary mb-6 border-l-4 pl-4 text-lg font-medium capitalize md:text-xl lg:text-2xl">
                Language Breakdown
              </h2>
              <div className="bg-secondary/20 rounded-lg p-6">
                <ul className="space-y-3">
                  {data.languages.map((lang) => (
                    <li
                      key={lang.language}
                      className="text-secondary-fg flex items-center gap-4"
                    >
                      <div
                        className="h-4 rounded-full"
                        style={{
                          backgroundColor: getLanguageColor(
                            lang.language ?? "",
                          ),
                          width: lang.percent
                            ? `${Math.max(lang.percent, 10)}%`
                            : "20px",
                          minWidth: "20px",
                        }}
                      />
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-secondary-fg/60 ml-auto text-sm">
                        {lang.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
        <section className="col-span-12 lg:col-span-4">
          <div className="lg:border-border lg:bg-secondary/20 top-10 h-fit w-full rounded-lg lg:sticky lg:border lg:p-6">
            <div className="bg-border mt-10 mb-6 h-px w-full lg:hidden" />

            {/* Project Info */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <IconTag className="text-secondary-fg/80 h-5 w-5" />
                <h2 className="text-fg text-lg font-medium">Project Info</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-secondary-fg/60 text-sm">Status:</span>
                  <div className="mt-1 flex items-center gap-2">
                    {renderStatusIcon(data.status)}
                    <span className="text-secondary-fg capitalize">
                      {data.status}
                    </span>
                  </div>
                </div>
                {data.tags && data.tags.length > 0 && (
                  <div>
                    <span className="text-secondary-fg/60 text-sm">
                      Technologies:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary/20 text-primary border-primary/30 rounded-full border px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-border my-6 h-px w-full" />

            {/* Quick Links */}
            <div className="mb-6">
              <h3 className="text-fg mb-3 text-sm font-medium tracking-wide uppercase">
                Quick Links
              </h3>
              <div className="space-y-2">
                {data.githubURL && (
                  <a
                    href={data.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary/40 hover:bg-secondary flex w-full items-center gap-3 rounded-lg p-3 transition-colors"
                  >
                    <IconBrandGithub className="h-5 w-5" />
                    <span>View Source Code</span>
                  </a>
                )}
                {data.liveURL && (
                  <a
                    href={data.liveURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary/40 hover:bg-secondary flex w-full items-center gap-3 rounded-lg p-3 transition-colors"
                  >
                    <IconExternalLink className="h-5 w-5" />
                    <span>Visit Live Site</span>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-border my-6 h-px w-full" />

            {/* Other Projects */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <IconLink className="text-secondary-fg/80 h-5 w-5" />
                <h2 className="text-fg text-lg font-medium">More Projects</h2>
              </div>
              <ul className="space-y-2">
                {otherProjects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="bg-secondary/20 hover:bg-secondary/40 block w-full rounded-lg p-3 transition-colors"
                    >
                      <div className="text-fg font-medium">{project.name}</div>
                      <div className="text-secondary-fg/60 text-sm">
                        {project.tagline}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
