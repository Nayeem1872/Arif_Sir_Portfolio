"use client";

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-fg text-xl font-semibold">Notifications</h2>
        <p className="text-text-secondary text-sm">
          Manage your notification preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-fg font-medium">Email Notifications</h3>
            <p className="text-text-secondary text-sm">
              Receive notifications via email
            </p>
          </div>
          <input
            type="checkbox"
            className="text-primary focus:ring-primary/50 border-border rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-fg font-medium">Blog Comments</h3>
            <p className="text-text-secondary text-sm">
              Get notified when someone comments on your blog
            </p>
          </div>
          <input
            type="checkbox"
            className="text-primary focus:ring-primary/50 border-border rounded"
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

export default NotificationSettings;
