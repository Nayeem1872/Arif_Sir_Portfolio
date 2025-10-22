"use client";

import { IconBell, IconSearch, IconUser } from "@tabler/icons-react";
import { useState } from "react";

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-card border-border border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="max-w-md flex-1">
          <div className="relative">
            <IconSearch
              className="text-fg/40 absolute top-1/2 left-3 -translate-y-1/2"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/40 border-border text-fg placeholder:text-fg/40 focus:ring-primary/50 focus:border-primary w-full rounded-md border py-2 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="hover:bg-secondary/50 text-fg/60 hover:text-fg relative rounded-md p-2 transition-colors">
            <IconBell size={20} />
            <span className="bg-primary absolute -top-1 -right-1 h-3 w-3 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-fg text-sm font-medium">John Doe</p>
              <p className="text-fg/60 text-xs">Admin</p>
            </div>
            <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
              <IconUser size={16} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
