export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  tokenExpiry: 24 * 60 * 60, // 24 hours in seconds
} as const;
