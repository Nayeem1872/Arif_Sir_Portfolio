import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Dashboard",
  description: "Manage your profile settings",
};

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-fg text-3xl font-bold">Profile</h1>
      </div>

      <div className="bg-card border-border rounded-lg border p-6">
        <h2 className="text-fg mb-4 text-xl font-semibold">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              defaultValue="John Doe"
            />
          </div>
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              defaultValue="john@example.com"
            />
          </div>
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              defaultValue="Full Stack Developer"
            />
          </div>
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              defaultValue="New York, USA"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-primary hover:bg-primary-dark text-bg rounded-md px-6 py-2 font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
