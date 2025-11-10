"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark theme on mount
    document.documentElement.className = "dark";
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    // Remove any stored theme preference to prevent conflicts
    localStorage.removeItem("theme");
  }, []);

  return <>{children}</>;
}
