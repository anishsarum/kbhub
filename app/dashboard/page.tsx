import type { Metadata } from "next";
import { DashboardContent } from "@/app/ui/dashboard/shared/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <DashboardContent />
    </div>
  );
}
