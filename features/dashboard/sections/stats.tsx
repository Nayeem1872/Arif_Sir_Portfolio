import {
  IconArrowUpRight,
  IconEye,
  IconHeart,
  IconMessage,
  IconUsers,
} from "@tabler/icons-react";

const stats = [
  {
    title: "Total Views",
    value: "12,345",
    change: "+12%",
    icon: IconEye,
    color: "text-blue-400",
  },
  {
    title: "Project Likes",
    value: "1,234",
    change: "+8%",
    icon: IconHeart,
    color: "text-red-400",
  },
  {
    title: "Messages",
    value: "89",
    change: "+23%",
    icon: IconMessage,
    color: "text-primary",
  },
  {
    title: "Followers",
    value: "567",
    change: "+5%",
    icon: IconUsers,
    color: "text-purple-400",
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`rounded-md bg-gray-100 p-2 ${stat.color} dark:bg-gray-700`}
            >
              <stat.icon size={20} />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
              <span>{stat.change}</span>
              <IconArrowUpRight size={16} />
            </div>
          </div>
          <div>
            <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
