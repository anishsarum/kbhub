"use client";

import {
  HomeIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: DocumentArrowUpIcon,
  },
  { name: "Search", href: "/dashboard/search", icon: MagnifyingGlassIcon },
  { name: "Library", href: "/dashboard/library", icon: BookOpenIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              {
                "bg-slate-800 text-white border-l-4 border-emerald-400":
                  isActive,
                "text-slate-300 hover:text-white hover:bg-slate-800": !isActive,
              }
            )}
          >
            <LinkIcon
              className={clsx("w-4 h-4", {
                "text-emerald-400": isActive,
                "text-slate-400": !isActive,
              })}
            />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
