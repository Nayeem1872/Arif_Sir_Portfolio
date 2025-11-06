"use client";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/cn";
import {
  IconArticle,
  IconChartArcs,
  IconChevronLeft,
  IconChevronRight,
  IconDashboard,
  IconLogout,
  IconMail,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: IconArticle,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: IconChartArcs,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: IconMail,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: IconSettings,
  },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        "flex flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-900",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Portfolio
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            {collapsed ? (
              <IconChevronRight size={20} />
            ) : (
              <IconChevronLeft size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                    isActive &&
                      "border border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
                  )}
                >
                  <item.icon size={20} />
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <IconLogout size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
