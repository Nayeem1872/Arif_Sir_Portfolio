"use client";

const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-fg text-xl font-semibold">Profile Settings</h2>
        <p className="text-text-secondary text-sm">
          Update your profile information and preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Display Name
            </label>
            <input
              type="text"
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="Your display name"
            />
          </div>
          <div>
            <label className="text-fg mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="text-fg mb-2 block text-sm font-medium">Bio</label>
          <textarea
            rows={4}
            className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex justify-end">
          <button className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
