import { siteUrl } from "@/config";
import { navLinks } from "@/config/navLinks";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-static";

export default async function sitemap() {
  const projectList = await getProjects();

  const projects = projectList.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt).toISOString(),
  }));

  const routes = navLinks
    .filter((l) => l.type !== "external")
    .map(({ href: route }) => ({
      url: `${siteUrl}${route !== "/" ? route : ""}`,
      lastModified: new Date().toISOString(),
    }));

  return [...routes, ...projects];
}
