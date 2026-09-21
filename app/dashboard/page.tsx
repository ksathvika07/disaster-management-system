import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  ChevronRight,
  Clock3,
  MapPin,
  Package,
  Siren,
  Users,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  const role = profile.role;

  const [
    disasterResult,
    emergencyResult,
    rescueResult,
    resourceResult,
    recentDisastersResult,
    recentRequestsResult,
  ] = await Promise.all([
    supabase
      .from("disaster_reports")
      .select(
        "id, disaster_type, ai_classification, ai_severity, ai_confidence, ai_status, description, latitude, longitude, created_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("emergency_requests")
      .select(
        "id, request_type, priority, status, description, location_name, latitude, longitude, created_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("rescue_teams")
      .select("id, team_name, specialization, is_available", {
        count: "exact",
      }),

    supabase
      .from("resources")
      .select(
        "id, resource_name, resource_type, quantity, unit, location_name, status",
        { count: "exact" }
      ),

    supabase
      .from("disaster_reports")
      .select(
        "id, disaster_type, ai_classification, ai_severity, ai_status, latitude, longitude, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("emergency_requests")
      .select(
        "id, request_type, priority, status, location_name, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const disasters = disasterResult.data ?? [];
  const emergencyRequests = emergencyResult.data ?? [];
  const rescueTeams = rescueResult.data ?? [];
  const resources = resourceResult.data ?? [];

  const recentDisasters = recentDisastersResult.data ?? [];
  const recentRequests = recentRequestsResult.data ?? [];

  const activeDisasters = disasters.filter(
    (item) =>
      item.ai_severity === "high" ||
      item.ai_severity === "critical"
  ).length;

  const activeRequests = emergencyRequests.filter(
    (item) =>
      item.status === "pending" ||
      item.status === "assigned" ||
      item.status === "in_progress"
  ).length;

  const availableTeams = rescueTeams.filter(
    (team) => team.is_available
  ).length;

  const availableResources = resources.filter(
    (resource) => resource.status === "available"
  ).length;

  const analyzedReports = disasters.filter(
    (item) => item.ai_status === "completed"
  ).length;

  const highCriticalReports = disasters.filter(
    (item) =>
      item.ai_severity === "high" ||
      item.ai_severity === "critical"
  ).length;

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const severityClass = (severity: string | null) => {
    switch (severity) {
      case "critical":
        return "border-red-400/30 bg-red-500/10 text-red-300";
      case "high":
        return "border-orange-400/30 bg-orange-500/10 text-orange-300";
      case "moderate":
        return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
      default:
        return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    }
  };

  const priorityClass = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-300 border-red-400/20";
      case "high":
        return "bg-orange-500/10 text-orange-300 border-orange-400/20";
      default:
        return "bg-blue-500/10 text-blue-300 border-blue-400/20";
    }
  };

  return (
    <main className="min-h-screen bg-[#061426] text-white">
      <DashboardHeader
        fullName={profile.full_name || "User"}
        role={role}
      />

      <div className="flex min-h-[calc(100vh-73px)]">
        <DashboardSidebar role={role} />

        <section className="min-w-0 flex-1 overflow-hidden">
          <div className="mx-auto max-w-[1550px] px-5 py-7 lg:px-8 lg:py-9">

            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="relative mb-7 overflow-hidden rounded-[28px] border border-[#183755] bg-[#081a30] px-6 py-7 lg:px-8 lg:py-8">

              {/* Subtle blue atmospheric background */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-1/3 bottom-0 h-40 w-72 rounded-full bg-cyan-500/5 blur-3xl" />

                {/* Minimal contour lines */}
                <svg
                  className="absolute bottom-0 right-0 h-full w-[58%] opacity-30"
                  viewBox="0 0 800 300"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 260 C100 220 130 245 220 205 C300 170 350 210 430 155 C510 100 560 165 650 105 C710 65 750 90 800 45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1"
                  />
                  <path
                    d="M0 280 C110 235 150 260 235 220 C315 185 365 225 445 170 C525 115 575 180 665 120 C725 80 760 105 800 60"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1"
                  />
                  <path
                    d="M30 300 C120 260 170 280 250 245 C330 210 390 240 465 190 C540 140 600 195 675 140 C735 100 770 125 800 80"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <div className="relative flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#67b7ff]">
                      {role === "citizen"
                        ? "Citizen Dashboard"
                        : "Response Control Center"}
                    </p>
                  </div>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#f4f8ff] sm:text-4xl">
                    Welcome, {profile.full_name || "User"}
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#87a4c2]">
                    {role === "citizen"
                      ? "Stay informed about your disaster reports and emergency requests."
                      : "Monitor disasters, emergency requests, resources and rescue operations."}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  <span className="text-xs font-medium text-emerald-300">
                    System Online
                  </span>
                </div>
              </div>
            </section>

            {/* =====================================================
                KPI CARDS
            ====================================================== */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <DashboardCard
                icon={AlertTriangle}
                label={
                  role === "citizen"
                    ? "Your Reports"
                    : "Active Disasters"
                }
                value={
                  role === "citizen"
                    ? disasters.length
                    : activeDisasters
                }
                accent="blue"
                href={
                  role === "citizen"
                    ? "/dashboard/report"
                    : "/dashboard/disasters"
                }
              />

              <DashboardCard
                icon={Siren}
                label="Emergency Requests"
                value={
                  role === "citizen"
                    ? emergencyRequests.length
                    : activeRequests
                }
                accent="cyan"
                href="/dashboard/emergency"
              />

              <DashboardCard
                icon={Users}
                label={
                  role === "rescue_team"
                    ? "Assigned Requests"
                    : "Available Rescue Teams"
                }
                value={
                  role === "rescue_team"
                    ? activeRequests
                    : availableTeams
                }
                accent="indigo"
                href={
                  role === "rescue_team"
                    ? "/dashboard/emergency"
                    : "/dashboard/rescue"
                }
              />

              <DashboardCard
                icon={Package}
                label="Available Resources"
                value={availableResources}
                accent="violet"
                href="/dashboard/resources"
              />
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">

              {/* RECENT DISASTERS */}

              <section className="overflow-hidden rounded-[24px] border border-[#183755] bg-[#081a2d]">

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183755] px-5 py-5 lg:px-6">

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/10">
                      <Activity size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-[#eef6ff]">
                        Recent Disaster Reports
                      </h2>

                      <p className="mt-0.5 text-xs text-[#718daa]">
                        Latest incidents received by the platform
                      </p>
                    </div>
                  </div>

                  {role !== "citizen" && (
                    <Link
                      href="/dashboard/disasters"
                      className="group flex items-center gap-1 rounded-full border border-[#24517b] px-3.5 py-2 text-xs font-medium text-[#73baff] transition hover:border-blue-400/50 hover:bg-blue-500/10"
                    >
                      View all
                      <ArrowUpRight
                        size={14}
                        className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  )}
                </div>

                {recentDisasters.length === 0 ? (
                  <EmptyState
                    icon={AlertTriangle}
                    title="No disaster reports yet"
                    description="New disaster reports will appear here."
                  />
                ) : (
                  <div className="divide-y divide-[#14304b]">
                    {recentDisasters.map((disaster) => (
                      <div
                        key={disaster.id}
                        className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-[#0b2239] sm:flex-row sm:items-center sm:justify-between lg:px-6"
                      >
                        <div className="flex min-w-0 gap-4">

                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/10">
                            <AlertTriangle size={18} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-medium capitalize text-[#edf5ff]">
                                {disaster.ai_classification ||
                                  disaster.disaster_type ||
                                  "Unknown disaster"}
                              </p>

                              {disaster.ai_status === "completed" && (
                                <span className="hidden rounded-full bg-emerald-400/5 px-2 py-0.5 text-[10px] text-emerald-300 sm:inline">
                                  AI analyzed
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#6f8ba8]">

                              <span className="flex items-center gap-1">
                                <Clock3 size={13} />
                                {formatDate(disaster.created_at)}
                              </span>

                              {disaster.latitude !== null &&
                                disaster.longitude !== null && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={13} />
                                    GPS available
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-14 sm:pl-0">
                          {disaster.ai_status && (
                            <span className="rounded-full border border-[#25435f] bg-[#0a1e34] px-3 py-1.5 text-[11px] text-[#87a4c2]">
                              AI {disaster.ai_status}
                            </span>
                          )}

                          {disaster.ai_severity && (
                            <span
                              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium capitalize ${severityClass(
                                disaster.ai_severity
                              )}`}
                            >
                              {disaster.ai_severity}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* AI PANEL */}

              <section className="overflow-hidden rounded-[24px] border border-[#183755] bg-[#081a2d]">

                <div className="border-b border-[#183755] px-5 py-5 lg:px-6">
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/10">
                        <BrainCircuit size={20} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-[#eef6ff]">
                          AI Disaster Analysis
                        </h2>

                        <p className="mt-0.5 text-xs text-[#718daa]">
                          Classification and severity assessment
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      AI Online
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-5 lg:p-6">

                  <AnalysisRow
                    label="Reports analyzed"
                    value={analyzedReports}
                  />

                  <AnalysisRow
                    label="High / Critical"
                    value={highCriticalReports}
                    danger={highCriticalReports > 0}
                  />

                  <AnalysisRow
                    label="Moderate"
                    value={
                      disasters.filter(
                        (item) => item.ai_severity === "moderate"
                      ).length
                    }
                  />

                  <AnalysisRow
                    label="Low"
                    value={
                      disasters.filter(
                        (item) => item.ai_severity === "low"
                      ).length
                    }
                  />

                  <div className="mt-5 rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 to-transparent p-4">

                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                        <BrainCircuit size={17} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-blue-200">
                          AI service active
                        </p>

                        <p className="mt-0.5 text-[11px] text-[#7190ae]">
                          Automated disaster assessment
                        </p>
                      </div>

                      <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    </div>

                    <p className="mt-3 text-xs leading-5 text-[#7895b2]">
                      Reports are analyzed for disaster type,
                      severity and confidence after submission.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* =====================================================
                PREPAREDNESS BANNER
            ====================================================== */}

            <section className="relative mt-6 overflow-hidden rounded-[24px] border border-[#1b4264] bg-[#0a2340]">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_35%)]" />

              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 135 C80 115 110 125 180 100 C250 75 280 110 350 70 C420 30 460 80 530 45 C560 30 580 35 600 20"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1"
                  />
                  <path
                    d="M0 150 C80 130 120 140 190 115 C260 90 290 125 360 85 C430 45 470 95 540 60 C570 45 585 50 600 35"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <div className="relative flex flex-wrap items-center justify-between gap-6 px-6 py-7 lg:px-8">

                <div>
                  <p className="font-serif text-xl italic text-[#dcecff] sm:text-2xl">
                    “Prepared today for a safer tomorrow.”
                  </p>

                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5ea9e8]">
                    Community · Response · Resilience
                  </p>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-blue-400/20 bg-blue-400/5 text-blue-300 sm:flex">
                  <ShieldCheck size={22} />
                </div>
              </div>
            </section>

            {/* =====================================================
                EMERGENCY REQUESTS
            ====================================================== */}

            <section className="mt-6 overflow-hidden rounded-[24px] border border-[#183755] bg-[#081a2d]">

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183755] px-5 py-5 lg:px-6">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/10">
                    <Siren size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#eef6ff]">
                      Recent Emergency Requests
                    </h2>

                    <p className="mt-0.5 text-xs text-[#718daa]">
                      Requests requiring emergency assistance
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/emergency"
                  className="group flex items-center gap-1 rounded-full border border-[#24517b] px-3.5 py-2 text-xs font-medium text-[#73baff] transition hover:border-blue-400/50 hover:bg-blue-500/10"
                >
                  Open requests
                  <ChevronRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {recentRequests.length === 0 ? (
                <EmptyState
                  icon={Siren}
                  title="No emergency requests yet"
                  description="Emergency assistance requests will appear here."
                />
              ) : (
                <div className="grid gap-3 p-4 lg:grid-cols-2 lg:p-5">

                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border border-[#173651] bg-[#06172a] p-4 transition hover:border-[#24517b] hover:bg-[#092039]"
                    >
                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
                              <Siren size={15} />
                            </span>

                            <p className="font-medium capitalize text-[#e8f2fc]">
                              {request.request_type}
                            </p>
                          </div>

                          <p className="mt-3 flex items-center gap-1.5 text-xs text-[#6f8ba8]">
                            <MapPin size={13} />
                            {request.location_name ||
                              "Location not specified"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-medium capitalize ${priorityClass(
                            request.priority
                          )}`}
                        >
                          {request.priority}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#14304b] pt-3 text-[11px] text-[#66829f]">
                        <span className="capitalize">
                          {request.status.replace("_", " ")}
                        </span>

                        <span>
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =====================================================
                AUTHORITY QUICK ACCESS
            ====================================================== */}

            {role !== "citizen" && (
              <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <QuickLink
                  href="/dashboard/disasters"
                  icon={AlertTriangle}
                  title="Disasters"
                  description="Review active incidents"
                />

                <QuickLink
                  href="/dashboard/emergency"
                  icon={Siren}
                  title="Emergency Requests"
                  description="Manage assistance requests"
                />

                <QuickLink
                  href="/dashboard/resources"
                  icon={Package}
                  title="Resources"
                  description="Monitor available supplies"
                />

                <QuickLink
                  href="/dashboard/rescue"
                  icon={Users}
                  title="Rescue Teams"
                  description="Coordinate response teams"
                />

              </section>
            )}

            {/* =====================================================
                LIVE MAP LINK
            ====================================================== */}

            <Link
              href="/dashboard/map"
              className="group mt-6 flex items-center justify-between rounded-[24px] border border-[#183755] bg-[#081a2d] px-5 py-5 transition hover:border-blue-400/30 hover:bg-[#0a2037] lg:px-6"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/10">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#eef6ff]">
                    Open Live Disaster Map
                  </h2>

                  <p className="mt-1 text-xs text-[#718daa]">
                    View GPS-based disaster locations and current map data.
                  </p>
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24517b] text-[#73baff] transition group-hover:bg-blue-500/10">
                <ChevronRight size={17} />
              </div>
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   KPI CARD
============================================================ */

function DashboardCard({
  icon: Icon,
  label,
  value,
  accent,
  href,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: number;
  accent: "blue" | "cyan" | "indigo" | "violet";
  href: string;
}) {
  const accentClasses = {
    blue: {
      icon: "bg-blue-500/10 text-blue-300",
      glow: "group-hover:border-blue-400/30",
      number: "text-blue-100",
    },
    cyan: {
      icon: "bg-cyan-500/10 text-cyan-300",
      glow: "group-hover:border-cyan-400/30",
      number: "text-cyan-100",
    },
    indigo: {
      icon: "bg-indigo-500/10 text-indigo-300",
      glow: "group-hover:border-indigo-400/30",
      number: "text-indigo-100",
    },
    violet: {
      icon: "bg-violet-500/10 text-violet-300",
      glow: "group-hover:border-violet-400/30",
      number: "text-violet-100",
    },
  };

  const colors = accentClasses[accent];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[22px] border border-[#183755] bg-[#081a2d] p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-[#0a2037] ${colors.glow}`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl transition group-hover:bg-blue-500/10" />

      <div className="relative flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-white/5 ${colors.icon}`}
        >
          <Icon size={20} />
        </div>

        <span
          className={`text-3xl font-semibold tracking-tight ${colors.number}`}
        >
          {value}
        </span>
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <p className="text-xs font-medium text-[#7895b2]">
          {label}
        </p>

        <ArrowUpRight
          size={15}
          className="text-[#3d668b] transition group-hover:text-[#73baff]"
        />
      </div>
    </Link>
  );
}

/* ============================================================
   AI ANALYSIS ROW
============================================================ */

function AnalysisRow({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#15324d] bg-[#06172a] px-4 py-3.5">
      <span className="text-xs text-[#7895b2]">
        {label}
      </span>

      <span
        className={`text-lg font-semibold ${
          danger ? "text-red-300" : "text-[#e8f2fc]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[170px] flex-col items-center justify-center p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-[#4f7192]">
        <Icon size={22} />
      </div>

      <p className="mt-4 font-medium text-[#a7bdd3]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#607b96]">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   QUICK ACCESS
============================================================ */

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof AlertTriangle;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[20px] border border-[#183755] bg-[#081a2d] p-5 transition hover:border-blue-400/30 hover:bg-[#0a2037]"
    >
      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
          <Icon size={18} />
        </div>

        <ArrowUpRight
          size={16}
          className="text-[#3d668b] transition group-hover:text-[#73baff]"
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#e8f2fc]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[#6986a2]">
        {description}
      </p>
    </Link>
  );
}