"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({
  href,
  children,
  className = "",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        ${className}
        block
        px-4 py-2
        rounded-md
        font-medium
        transition-colors duration-150
        ${
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
        }
      `}
    >
      {children}
    </Link>
  );
}
