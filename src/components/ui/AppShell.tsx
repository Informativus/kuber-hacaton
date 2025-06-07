"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import TopNavbar from "./TopNavbar";
import ProfileModal from "@/components/ProfileModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);
  const pathname = usePathname();

  const hideNavbarRoutes = ["/auth"];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && (
        <TopNavbar onProfileClick={() => setShowProfile(true)} />
      )}

      <main>{children}</main>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
