// components/ui/ProjectNavbar.tsx
"use client";

import React from "react";
import NavLink from "./NavLink";

export default function ProjectNavbar() {
  const projects = ["project1", "project2", "project3"];

  return (
    <aside className="w-60 h-full bg-gray-100 border-r border-gray-200 p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Проекты</h2>
      <nav className="flex flex-col gap-2">
        {projects.map((project) => (
          <NavLink key={project} href={`/dashboard/projects/${project}`}>
            {project}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
