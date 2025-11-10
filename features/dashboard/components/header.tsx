"use client";

import { useAuth } from "@/hooks/use-auth";
import { tokenManager, User } from "@/lib/api/auth";
import {
  IconBell,
  IconLogout,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";


const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const userData = tokenManager.getUser();
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showProfileMenu) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfileMenu]);

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


          {/* Notifications */}
          <button className="relative rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <IconBell size={20} />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500"></span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <IconUser
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <IconLogout size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
