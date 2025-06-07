// components/ui/ProjectNavbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import NavLink from "./NavLink";
import apiDash from "@/services/apiDash";

interface Project {
  id: number;
  name: string;
  createdAt: string;
}

interface Projects {
  id: number;
  userId: number;
  projectId: number;
  createdAt: string;
  project: Project;
}

interface ProjectProps {
  collection: {
    id: number;
    userId: string;
    username: string;
    createdAt: string;
    projects: Projects[];
  };
  code: number;
}

async function getProjects(userId: string) {
  try {
    const result = await apiDash.post<ProjectProps>("k8s/project/list", {
      userId,
    });
    return result.data.collection.projects.map((project) => {
      return { id: project.project.id, name: project.project.name };
    });
  } catch (e) {
    return [];
  }
}

export default function ProjectNavbar() {
  const [projects, setProjects] = useState<{ name: string; id: number }[]>([]);

  const userId = "123";

  useEffect(() => {
    async function wrapper() {
      const serverProject = await getProjects(userId);
      setProjects(serverProject);
    }
    wrapper();
  }, []);

  return (
    <aside className="w-60 h-full bg-gray-100 border-r border-gray-200 p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Проекты</h2>
      <nav className="flex flex-col gap-2">
        {projects.map((project) => (
          <NavLink key={project.id} href={`/dashboard/projects/${project.id}`}>
            {project.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
