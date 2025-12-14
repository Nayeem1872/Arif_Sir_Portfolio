export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com/api"
      : "https://arif-sir-blog-backend.onrender.com/api"),
  blogApiBaseUrl:
    process.env.NEXT_PUBLIC_BLOG_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com/api/blog"
      : "https://arif-sir-blog-backend.onrender.com/api/blog"),
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com"
      : "https://arif-sir-blog-backend.onrender.com",
  imageBaseUrl:
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com"
      : "https://arif-sir-blog-backend.onrender.com"),
} as const;
