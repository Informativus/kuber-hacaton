import SideNavbar from '@/components/ui/SideNavbar';
import TopNavbar from '@/components/ui/TopNavbar';
import { ReactNode } from 'react';


export default async function DashboardLayout({ children }: { children: ReactNode }) {
  
  return (
    <div className="flex h-screen text-black bg-gray-300">
        <SideNavbar />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-100">
          {children}
        </main>
    </div>
  );
}