import ProtectedRoute from "@/components/auth/protected-route";
import DashboardHeader from "@/features/dashboard/components/header";
import DashboardSidebar from "@/features/dashboard/components/sidebar";
import ThemeScript from "@/features/dashboard/components/theme-script";
import { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <ProtectedRoute>
      <ThemeScript />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex h-screen">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-800">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
