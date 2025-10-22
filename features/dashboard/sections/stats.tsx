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
          className="bg-card border-border hover:border-primary/20 rounded-lg border p-6 transition-colors"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className={`bg-secondary/40 rounded-md p-2 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-primary flex items-center gap-1 text-sm">
              <span>{stat.change}</span>
              <IconArrowUpRight size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-fg mb-1 text-2xl font-bold">{stat.value}</h3>
            <p className="text-fg/60 text-sm">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
