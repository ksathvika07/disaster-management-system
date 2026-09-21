import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Siren,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

type NotificationItem = {
  id: string;
  type: "disaster" | "emergency";
  title: string;
  description: string;
  status: string;
  created_at: string;
};

export default async function NotificationsPage() {
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

  const isCitizen = profile.role === "citizen";

  let disasterQuery = supabase
    .from("disaster_reports")
    .select(
      "id, disaster_type, description, ai_severity, ai_status, created_at, reporter_id"
    )
    .order("created_at", { ascending: false })
    .limit(10);

  let emergencyQuery = supabase
    .from("emergency_requests")
    .select(
      "id, request_type, description, priority, status, created_at, requested_by"
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (isCitizen) {
    disasterQuery = disasterQuery.eq("reporter_id", user.id);
    emergencyQuery = emergencyQuery.eq("requested_by", user.id);
  }

  const [{ data: disasters }, { data: emergencies }] =
    await Promise.all([disasterQuery, emergencyQuery]);

  const notifications: NotificationItem[] = [
    ...(disasters ?? []).map((disaster) => ({
      id: `disaster-${disaster.id}`,
      type: "disaster" as const,
      title: `Disaster report: ${String(
        disaster.disaster_type
      ).replace(/_/g, " ")}`,
      description:
        disaster.description || "A disaster report was submitted.",
      status:
        disaster.ai_status === "completed"
          ? `AI analyzed • ${disaster.ai_severity || "severity pending"}`
          : "AI analysis pending",
      created_at: disaster.created_at,
    })),

    ...(emergencies ?? []).map((request) => ({
      id: `emergency-${request.id}`,
      type: "emergency" as const,
      title: `Emergency request: ${String(
        request.request_type
      ).replace(/_/g, " ")}`,
      description:
        request.description || "An emergency assistance request was submitted.",
      status: `${request.priority} priority • ${String(
        request.status
      ).replace(/_/g, " ")}`,
      created_at: request.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 20);

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <DashboardHeader
        fullName={profile.full_name || "User"}
        role={profile.role}
      />

      <div className="flex min-h-[calc(100vh-73px)]">
        <DashboardSidebar role={profile.role} />

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <Bell size={22} />
                </div>

                <div>
                  <p className="text-sm font-medium text-red-400">
                    SYSTEM ACTIVITY
                  </p>

                  <h1 className="mt-1 text-3xl font-bold">
                    Notifications
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8796A8]">
                View recent disaster reports, emergency requests,
                AI analysis updates, and response activity.
              </p>
            </div>

            {/* Activity summary */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#203449] bg-[#0B1A2B] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Bell size={19} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#718195]">
                      Recent activity
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {notifications.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#203449] bg-[#0B1A2B] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    <AlertTriangle size={19} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#718195]">
                      Disaster reports
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {disasters?.length ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#203449] bg-[#0B1A2B] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Siren size={19} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#718195]">
                      Emergency requests
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {emergencies?.length ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification list */}
            <div className="overflow-hidden rounded-2xl border border-[#203449] bg-[#0B1A2B]">
              <div className="border-b border-[#203449] px-6 py-5">
                <h2 className="text-lg font-semibold">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-[#718195]">
                  Latest events recorded by the response platform.
                </p>
              </div>

              {notifications.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center px-6">
                  <div className="text-center">
                    <Bell
                      size={40}
                      className="mx-auto text-[#536579]"
                    />

                    <h3 className="mt-4 text-lg font-semibold">
                      No notifications yet
                    </h3>

                    <p className="mt-2 text-sm text-[#718195]">
                      New disaster reports and emergency activity
                      will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#203449]">
                  {notifications.map((notification) => {
                    const isDisaster =
                      notification.type === "disaster";

                    return (
                      <div
                        key={notification.id}
                        className="flex gap-4 px-6 py-5 transition hover:bg-[#0F2033]"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isDisaster
                              ? "bg-orange-500/10 text-orange-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {isDisaster ? (
                            <AlertTriangle size={20} />
                          ) : (
                            <Siren size={20} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-semibold capitalize">
                              {notification.title}
                            </h3>

                            <span className="flex items-center gap-1.5 text-xs text-[#718195]">
                              <Clock3 size={13} />

                              {new Date(
                                notification.created_at
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-[#8796A8]">
                            {notification.description}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <CheckCircle2
                              size={15}
                              className="text-green-400"
                            />

                            <span className="text-xs capitalize text-[#718195]">
                              {notification.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}