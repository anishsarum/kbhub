import Link from "next/link";
import { clsx } from "clsx";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Breadcrumb } from "@/app/lib/definitions";

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className="flex items-center"
          >
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-slate-400 mx-2" />
            )}
            <Link
              href={breadcrumb.href}
              className={clsx(
                "hover:text-emerald-600 transition-colors",
                breadcrumb.active
                  ? "text-slate-900 font-medium cursor-default"
                  : "text-slate-600 hover:text-emerald-600"
              )}
            >
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
