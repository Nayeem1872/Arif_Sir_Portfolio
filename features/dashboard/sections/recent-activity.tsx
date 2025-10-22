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
    <div className="bg-card border-border rounded-lg border p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-fg text-lg font-semibold">Recent Activity</h3>
        <IconClock className="text-fg/40" size={20} />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="hover:bg-secondary/20 flex items-start gap-4 rounded-md p-3 transition-colors"
          >
            <div
              className={`bg-secondary/40 rounded-md p-2 ${activity.color} shrink-0`}
            >
              <activity.icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-fg text-sm">{activity.message}</p>
              <p className="text-fg/60 mt-1 text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border mt-6 border-t pt-4">
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
