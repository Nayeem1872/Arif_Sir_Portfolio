import DashboardHeader from "@/features/dashboard/components/header";
import DashboardSidebar from "@/features/dashboard/components/sidebar";
import { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-bg min-h-screen">
      <div className="flex h-screen">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="bg-bg flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
