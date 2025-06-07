import React from "react";
import ClusterNavbar from "@/components/ui/ClusterNavbar";
import { ReactNode } from "react";

export default function ClusterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col bg-gray-50 text-gray-900 overflow-hidden rounded-lg shadow-lg">
      <div className="rounded-lg overflow-hidden w-full">
        <ClusterNavbar />
      </div>

      <main className="flex-1 overflow-auto p-6 bg-white rounded-lg">
        {children}
      </main>
    </div>
  );
}