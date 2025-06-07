import React from "react";
import ProjectNavbar from "@/components/ui/ProjectNavbar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden rounded-lg shadow-lg">
      <div className="rounded-lg overflow-hidden">
        <ProjectNavbar />
      </div>

      <main className="flex-1 overflow-auto p-6 bg-white rounded-lg">
        {children}
      </main>
    </div>
  );
}
