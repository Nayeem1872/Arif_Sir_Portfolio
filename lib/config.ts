export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com/api"
      : "http://localhost:8000/api"),
  blogApiBaseUrl:
    process.env.NEXT_PUBLIC_BLOG_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com/api/blog"
      : "http://localhost:8000/api/blog"),
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com"
      : "http://localhost:8000",
} as const;
