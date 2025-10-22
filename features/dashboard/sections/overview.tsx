import { IconTrendingUp } from "@tabler/icons-react";

const DashboardOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Chart Placeholder */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Analytics Overview
          </h3>
          <IconTrendingUp
            className="text-blue-600 dark:text-blue-400"
            size={20}
          />
        </div>
        <div className="flex h-64 items-center justify-center rounded-md bg-gray-50 dark:bg-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Chart visualization would go here
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Actions
        </h3>
        <div className="space-y-4">
          <button className="w-full rounded-md bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
            <h4 className="mb-1 font-medium text-gray-900 dark:text-gray-100">
              Add New Project
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and showcase a new project
            </p>
          </button>
          <button className="w-full rounded-md bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
            <h4 className="mb-1 font-medium text-gray-900 dark:text-gray-100">
              Update Profile
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Edit your personal information
            </p>
          </button>
          <button className="w-full rounded-md bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
            <h4 className="mb-1 font-medium text-gray-900 dark:text-gray-100">
              View Messages
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check new contact messages
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
