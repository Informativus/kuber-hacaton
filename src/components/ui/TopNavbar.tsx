"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavbar() {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/auth"];
  if (hideNavbarRoutes.includes(pathname)) return null;

  const links = [
    { href: "/", label: "Начало" },
    { href: "/dashboard", label: "Дашборд" },
    {
      href: "/auth",
      label: "Войти",
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex justify-around items-center h-16 px-4">
        {links.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
