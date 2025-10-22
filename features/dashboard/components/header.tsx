"use client";

import { IconBell, IconSearch, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import ThemeToggle from "./theme-toggle";

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="max-w-md flex-1">
          <div className="relative">
            <IconSearch
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <IconBell size={20} />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <IconUser
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
