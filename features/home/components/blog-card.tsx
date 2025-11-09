import { config } from "@/lib/config";
import type { Blog } from "@/types/data";
import { IconArrowRight } from "@tabler/icons-react";

interface BlogCardProps {
  blog: Blog;
  isPrimary?: boolean;
  onPostClick?: (blog: Blog) => void;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop";

const BlogCard = ({ blog, isPrimary = false, onPostClick }: BlogCardProps) => {
  // Get image URL - prioritize images array, fallback to legacy image field
  const imageUrl = blog.images?.[0] || blog.image || DEFAULT_IMAGE;

  // Build full URL only if it's a relative path
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${config.imageBaseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

  // Debug logging for image URL issues
  console.log("🖼️ BlogCard Image Debug:", {
    blogId: blog._id,
    blogTitle: blog.title,
    hasImagesArray: !!blog.images,
    imagesArrayLength: blog.images?.length || 0,
    firstImageInArray: blog.images?.[0] || "N/A",
    legacyImageField: blog.image || "N/A",
    selectedImageUrl: imageUrl,
    isFullUrl: imageUrl.startsWith("http"),
    imageBaseUrl: config.imageBaseUrl,
    finalImageUrl: fullImageUrl,
    possibleIssues: [
      !blog.images?.length &&
        !blog.image &&
        "⚠️ No images array or legacy image field",
      blog.images?.length &&
        !blog.images[0] &&
        "⚠️ Images array exists but first item is empty/undefined",
      imageUrl &&
        !imageUrl.startsWith("http") &&
        !config.imageBaseUrl &&
        "⚠️ Relative URL but no imageBaseUrl configured",
      imageUrl === DEFAULT_IMAGE && "ℹ️ Using default fallback image",
    ].filter(Boolean),
  });

  // Extract read time number
  const readTime = blog.readTime ? parseInt(blog.readTime) || 5 : 5;

  return (
    <div
      style={{ backgroundImage: `url(${fullImageUrl})` }}
      className={`group relative row-span-1 flex size-full cursor-pointer flex-col justify-end overflow-hidden rounded-[16px] bg-cover bg-center bg-no-repeat p-4 text-white transition-all duration-300 hover:scale-[0.98] hover:rotate-[0.3deg] max-md:h-[250px] ${
        isPrimary
          ? "col-span-1 row-span-1 md:col-span-2 md:row-span-2 lg:col-span-1"
          : ""
      }`}
      onClick={() => onPostClick?.(blog)}
    >
      <div className="absolute inset-0 -z-0 h-[130%] w-full bg-gradient-to-t from-black/80 to-transparent transition-all duration-500 group-hover:h-full" />

      <article className="relative z-0 flex items-end">
        <div className="flex flex-1 flex-col gap-2">
          <h1
            className={`leading-tight font-semibold ${isPrimary ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
          >
            {blog.title}
          </h1>

          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-md bg-white/40 px-2 py-1 text-xs text-white capitalize backdrop-blur-md">
              {blog.category}
            </span>

            <div className="text-sm font-medium">{readTime} min read</div>
          </div>
        </div>

        <IconArrowRight
          className="transition-all duration-300 group-hover:translate-x-2"
          color="white"
          size={24}
          stroke={1.5}
        />
      </article>
    </div>
  );
};

export default BlogCard;
