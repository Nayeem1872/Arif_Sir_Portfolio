import DashboardOverview from "@/features/dashboard/sections/overview";
import RecentActivity from "@/features/dashboard/sections/recent-activity";
import DashboardStats from "@/features/dashboard/sections/stats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Portfolio",
  description: "Your personal dashboard",
};

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back!</p>
      </div>

      <DashboardStats />
      <DashboardOverview />
      <RecentActivity />
    </div>
  );
};

export default DashboardPage;
