import Link from "next/link";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import NavLinks from "@/app/ui/dashboard/shared/nav-links";
import KBHubLogo from "@/app/ui/shared/logo";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Logo/Brand */}
      <Link
        className="flex h-16 items-center px-6 border-b border-slate-700 hover:bg-slate-800 transition-colors"
        href="/dashboard"
      >
        <KBHubLogo />
      </Link>

      {/* Navigation */}
      <div className="flex flex-1 flex-col">
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLinks />
        </nav>

        {/* Sign Out */}
        <div className="border-t border-slate-700 p-4">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group">
              <PowerIcon className="w-4 h-4 group-hover:text-red-400 transition-colors" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
