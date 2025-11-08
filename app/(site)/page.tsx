import BlogSection from "@/features/home/sections/blogs";
import HeroSection from "@/features/home/sections/hero";
import Metrics from "@/features/home/sections/metrics";
import ServiceSection from "@/features/home/sections/service";
import TechnologySection from "@/features/home/sections/technology";
import GallerySection from "@/features/projects/sections/gallery";
import { getBlogs, getProfile, getServices, getTech } from "@/lib/queries";

export const revalidate = 60;

const HomePage = async () => {
  const profile = await getProfile();
  const blogs = await getBlogs();
  const services = await getServices();
  const techs = await getTech();

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <HeroSection profile={profile} />
      <TechnologySection techs={techs} />
      <ServiceSection services={services} />
      <GallerySection />
      <BlogSection blogs={blogs} />
      <Metrics metrics={profile?.metrics} />
    </div>
  );
};

export default HomePage;
