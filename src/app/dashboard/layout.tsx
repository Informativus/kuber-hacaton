import React from "react";
import SideNavbar from "@/components/ui/SideNavbar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <SideNavbar />
      <main className="flex-1 overflow-auto p-6 bg-white">{children}</main>
    </div>
  );
}

