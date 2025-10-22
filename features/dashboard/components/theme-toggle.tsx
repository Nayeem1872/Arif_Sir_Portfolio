"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("dashboard-theme") as
      | "light"
      | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    const body = document.body;

    if (newTheme === "dark") {
      root.classList.add("dark");
      body.style.backgroundColor = "#111827";
      body.style.color = "#f3f4f6";
    } else {
      root.classList.remove("dark");
      body.style.backgroundColor = "white";
      body.style.color = "#374151";
    }
  };

  const toggleTheme = () => {
    console.log("Toggle clicked, current theme:", theme);
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("New theme:", newTheme);
    setTheme(newTheme);
    localStorage.setItem("dashboard-theme", newTheme);
    applyTheme(newTheme);
    console.log(
      "Document classes after toggle:",
      document.documentElement.classList.toString(),
    );
  };

  if (!mounted) {
    return (
      <button className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
        <IconMoon size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
    </button>
  );
};

export default ThemeToggle;
