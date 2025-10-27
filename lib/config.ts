export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://arif-sir-blog-backend.onrender.com/api"
      : "http://localhost:8000/api"),
} as const;
