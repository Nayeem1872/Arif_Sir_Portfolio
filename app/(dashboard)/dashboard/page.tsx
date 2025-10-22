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
        <h1 className="text-fg text-3xl font-bold">Dashboard</h1>
        <p className="text-fg/60">Welcome back!</p>
      </div>

      <DashboardStats />
      <DashboardOverview />
      <RecentActivity />
    </div>
  );
};

export default DashboardPage;
