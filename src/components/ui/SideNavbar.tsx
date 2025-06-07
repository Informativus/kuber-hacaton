"use client";

import React from "react";
import NavLink from "./CustomLink";

export default function SideNavbar() {
  return (
    <aside className="w-60 h-full bg-gray-100 border-r border-gray-200 p-4 space-y-4">
      <h2 className="px-4 text-lg font-bold text-gray-900">Меню</h2>
      <nav className="flex flex-col gap-2">
        <NavLink href="/dashboard/projects">Проекты</NavLink>
        <NavLink href="/dashboard/settings">Настройки</NavLink>
      </nav>
    </aside>
  );
}
