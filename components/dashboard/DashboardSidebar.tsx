"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  ClipboardList,
  Home,
  MapPin,
  Package,
  ShieldAlert,
  Siren,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

type DashboardSidebarProps = {
  role: string;
};

export default function DashboardSidebar({
  role,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const citizenLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/report",
      label: "Report Disaster",
      icon: AlertTriangle,
    },
    {
      href: "/dashboard/emergency",
      label: "Emergency Request",
      icon: Siren,
    },
    {
      href: "/dashboard/map",
      label: "Live Map",
      icon: MapPin,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
    },
  ];

  const authorityLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/disasters",
      label: "Disasters",
      icon: AlertTriangle,
    },
    {
      href: "/dashboard/emergency",
      label: "Emergency Requests",
      icon: Siren,
    },
    {
      href: "/dashboard/resources",
      label: "Resources",
      icon: Package,
    },
    {
      href: "/dashboard/rescue",
      label: "Rescue Teams",
      icon: Users,
    },
    {
      href: "/dashboard/map",
      label: "Live Map",
      icon: MapPin,
    },
  ];

  const rescueLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/emergency",
      label: "Assigned Requests",
      icon: Siren,
    },
    {
      href: "/dashboard/map",
      label: "Live Map",
      icon: MapPin,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
    },
  ];

  const adminLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/disasters",
      label: "Disasters",
      icon: AlertTriangle,
    },
    {
      href: "/dashboard/emergency",
      label: "Emergency Requests",
      icon: Siren,
    },
    {
      href: "/dashboard/resources",
      label: "Resources",
      icon: Package,
    },
    {
      href: "/dashboard/rescue",
      label: "Rescue Teams",
      icon: Users,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/map",
      label: "Live Map",
      icon: MapPin,
    },
  ];

  let links = citizenLinks;

  if (role === "authority") {
    links = authorityLinks;
  } else if (role === "rescue_team") {
    links = rescueLinks;
  } else if (role === "admin") {
    links = adminLinks;
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#173653] bg-[#061426] lg:block">
      <div className="sticky top-0 flex min-h-[calc(100vh-73px)] flex-col p-4">

        {/* Navigation heading */}
        <div className="mb-5 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#50708F]">
            Navigation
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border border-blue-400/20 bg-gradient-to-r from-blue-500/20 to-blue-500/5 text-[#dceeff] shadow-[0_0_24px_rgba(37,99,235,0.08)]"
                    : "border border-transparent text-[#7895B2] hover:border-[#173A5B] hover:bg-[#0A1D32] hover:text-[#dcecff]"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                )}

                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    isActive
                      ? "bg-blue-500/15 text-blue-300"
                      : "bg-transparent text-[#64819E] group-hover:text-blue-300"
                  }`}
                >
                  <Icon size={17} />
                </span>

                <span>{item.label}</span>

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#214563] to-transparent" />

        {/* Platform information */}
        <div className="relative mt-auto overflow-hidden rounded-2xl border border-[#193B5B] bg-[#081A2D] p-5">

          {/* subtle blue glow */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="relative">

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                <ShieldAlert size={16} />
              </div>

              <span className="text-xs font-semibold text-[#dcecff]">
                Response Platform
              </span>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-[#64819E]">
              Cloud-connected emergency management system.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-300">
                Platform Online
              </span>
            </div>
          </div>
        </div>

        {/* Small branding */}
        <div className="px-3 pb-1 pt-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#365773]">
            Community · Response · Resilience
          </p>
        </div>

      </div>
    </aside>
  );
}