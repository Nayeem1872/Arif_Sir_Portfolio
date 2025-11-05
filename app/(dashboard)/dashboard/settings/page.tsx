"use client";

import {
  IconBell,
  IconFileText,
  IconLock,
  IconPalette,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import {
  AppearanceSettings,
  CVConfigSettings,
  NotificationSettings,
  ProfileSettings,
  SecuritySettings,
} from "./components";

const settingsTabs = [
  {
    id: "profile",
    label: "Profile",
    icon: IconUser,
  },
  {
    id: "cv-config",
    label: "CV Config",
    icon: IconFileText,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: IconPalette,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: IconBell,
  },
  {
    id: "security",
    label: "Security",
    icon: IconLock,
  },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "cv-config":
        return <CVConfigSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-fg text-3xl font-bold">Settings</h1>
        <p className="text-text-secondary">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="bg-card border-border w-64 rounded-lg border p-4">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border-primary/20 border"
                    : "text-text-secondary hover:bg-secondary/40 hover:text-fg"
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-card border-border flex-1 rounded-lg border p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
