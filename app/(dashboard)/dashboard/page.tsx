import DashboardOverview from "@/features/dashboard/sections/overview";
import RecentActivity from "@/features/dashboard/sections/recent-activity";
import DashboardStats from "@/features/dashboard/sections/stats";
import { getProfile } from "@/lib/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Portfolio",
  description: "Your personal dashboard",
};

const DashboardPage = async () => {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-fg text-3xl font-bold">Dashboard</h1>
          <p className="text-text-secondary">Welcome back, {profile.name}!</p>
        </div>
        <div className="text-right">
          <p className="text-text-muted text-sm">{profile.tagline}</p>
          <p className="text-text-muted text-sm">{profile.location}</p>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h2 className="text-fg mb-4 text-xl font-semibold">Profile Summary</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {profile.metrics?.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-primary text-2xl font-bold">
                {metric.value}
              </div>
              <div className="text-text-muted text-sm">{metric.label}</div>
            </div>
          ))}
        </div>
        <div className="border-border mt-4 border-t pt-4">
          <p className="text-text-secondary">{profile.bio}</p>
        </div>
      </div>

      <DashboardStats />
      <DashboardOverview />
      <RecentActivity />
    </div>
  );
};

export default DashboardPage;
