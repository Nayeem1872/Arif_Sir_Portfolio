"use client";

import { cn } from "@/utils/cn";
import {
  IconBriefcase,
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
    title: "Projects",
    href: "/dashboard/projects",
    icon: IconBriefcase,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
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

  return (
    <div
      className={cn(
        "bg-card border-border flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="border-border border-b p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-fg text-lg font-semibold">Portfolio</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-secondary/50 text-fg/60 hover:text-fg rounded-md p-1 transition-colors"
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
                    "hover:bg-secondary/50 text-fg/80 hover:text-fg",
                    isActive &&
                      "bg-primary/10 text-primary border-primary/20 border",
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
      <div className="border-border border-t p-4">
        <button className="hover:bg-secondary/50 text-fg/80 hover:text-fg flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors">
          <IconLogout size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
