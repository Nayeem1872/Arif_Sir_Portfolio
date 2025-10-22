import {
  IconClock,
  IconEye,
  IconHeart,
  IconMessage,
} from "@tabler/icons-react";

const activities = [
  {
    type: "view",
    message: "Your portfolio was viewed 15 times",
    time: "2 hours ago",
    icon: IconEye,
    color: "text-blue-400",
  },
  {
    type: "message",
    message: "New message from Sarah Johnson",
    time: "4 hours ago",
    icon: IconMessage,
    color: "text-primary",
  },
  {
    type: "like",
    message: "Project 'E-commerce App' received 3 new likes",
    time: "6 hours ago",
    icon: IconHeart,
    color: "text-red-400",
  },
  {
    type: "view",
    message: "Your about page was viewed 8 times",
    time: "1 day ago",
    icon: IconEye,
    color: "text-blue-400",
  },
];

const RecentActivity = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Activity
        </h3>
        <IconClock className="text-gray-400 dark:text-gray-500" size={20} />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div
              className={`rounded-md bg-gray-100 p-2 ${activity.color} shrink-0 dark:bg-gray-700`}
            >
              <activity.icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {activity.message}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
