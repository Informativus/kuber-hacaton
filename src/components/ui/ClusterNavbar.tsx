"use client";

import React from "react";
import NavLink from "./CustomLink";
import { useParams, usePathname } from "next/navigation";

export default function ClusterNavbar() {
  const params = useParams();
  const pathname = `/dashboard/projects/${params.project}/${params.cluster}`;
  return (
    <aside className="w-full h-full bg-gray-100 border-r border-gray-200 p-4 space-y-4">
      <h2 className="px-4 text-lg font-bold text-gray-900">
        Редактировать кластер {params.cluster}
      </h2>
      <nav className="flex gap-2">
        <NavLink href={`${pathname}/metrics`} className="w-fit">
          Метрики
        </NavLink>
        <NavLink href={`${pathname}/deployment`} className="w-fit">
          Деплоймент
        </NavLink>
        <NavLink href={`${pathname}/settings`}>Настройки</NavLink>
        <NavLink href={`${pathname}/namespaces`}>Namespaces</NavLink>
      </nav>
    </aside>
  );
}
