"use client";

const AppearanceSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-fg text-xl font-semibold">Appearance</h2>
        <p className="text-text-secondary text-sm">
          Customize the look and feel of your dashboard
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-fg mb-2 block text-sm font-medium">
            Theme
          </label>
          <select className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>

        <div>
          <label className="text-fg mb-2 block text-sm font-medium">
            Primary Color
          </label>
          <div className="flex gap-3">
            <div className="h-10 w-10 cursor-pointer rounded-full border-2 border-transparent bg-blue-500 hover:border-gray-300"></div>
            <div className="h-10 w-10 cursor-pointer rounded-full border-2 border-transparent bg-green-500 hover:border-gray-300"></div>
            <div className="h-10 w-10 cursor-pointer rounded-full border-2 border-transparent bg-purple-500 hover:border-gray-300"></div>
            <div className="h-10 w-10 cursor-pointer rounded-full border-2 border-transparent bg-red-500 hover:border-gray-300"></div>
          </div>
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

export default AppearanceSettings;
