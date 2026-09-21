import { ChevronDown, ShieldAlert } from "lucide-react";

import LogoutButton from "./LogoutButton";

type DashboardHeaderProps = {
  fullName: string;
  role: string;
};

export default function DashboardHeader({
  fullName,
  role,
}: DashboardHeaderProps) {
  const roleLabel =
    role === "rescue_team"
      ? "Rescue Team"
      : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className="sticky top-0 z-40 border-b border-[#173653] bg-[#061426]/95 backdrop-blur-xl">
      <div className="flex h-[73px] items-center justify-between px-5 lg:px-7">

        {/* Brand */}
        <div className="flex items-center gap-3">

          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
            <div className="absolute inset-0 rounded-xl bg-blue-500/5 blur-md" />
            <ShieldAlert size={21} className="relative" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-[#e8f2fc]">
              DISASTER RESPONSE
            </p>

            <p className="mt-0.5 text-[11px] text-[#607f9d]">
              Emergency Management Platform
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* System indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
              Online
            </span>
          </div>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-[#1b3b58] sm:block" />

          {/* User */}
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/25 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-sm font-semibold text-blue-100">
              {(fullName || "U").charAt(0).toUpperCase()}
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#e8f2fc]">
                {fullName || "User"}
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#659bd0]">
                {roleLabel}
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden text-[#52728f] sm:block"
            />
          </div>

          {/* Logout */}
          <div className="w-auto sm:w-28">
            <LogoutButton />
          </div>

        </div>
      </div>
    </header>
  );
}