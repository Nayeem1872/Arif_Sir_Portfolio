import { IconTrendingUp } from "@tabler/icons-react";

const DashboardOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Chart Placeholder */}
      <div className="bg-card border-border rounded-lg border p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-fg text-lg font-semibold">Analytics Overview</h3>
          <IconTrendingUp className="text-primary" size={20} />
        </div>
        <div className="bg-secondary/20 flex h-64 items-center justify-center rounded-md">
          <p className="text-fg/60">Chart visualization would go here</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h3 className="text-fg mb-6 text-lg font-semibold">Quick Actions</h3>
        <div className="space-y-4">
          <button className="bg-secondary/20 hover:bg-secondary/40 w-full rounded-md p-4 text-left transition-colors">
            <h4 className="text-fg mb-1 font-medium">Add New Project</h4>
            <p className="text-fg/60 text-sm">
              Create and showcase a new project
            </p>
          </button>
          <button className="bg-secondary/20 hover:bg-secondary/40 w-full rounded-md p-4 text-left transition-colors">
            <h4 className="text-fg mb-1 font-medium">Update Profile</h4>
            <p className="text-fg/60 text-sm">Edit your personal information</p>
          </button>
          <button className="bg-secondary/20 hover:bg-secondary/40 w-full rounded-md p-4 text-left transition-colors">
            <h4 className="text-fg mb-1 font-medium">View Messages</h4>
            <p className="text-fg/60 text-sm">Check new contact messages</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
