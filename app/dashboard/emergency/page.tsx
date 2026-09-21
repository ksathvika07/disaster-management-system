import { redirect } from "next/navigation";
import { Siren } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import EmergencyRequestForm from "@/components/emergency/EmergencyRequestForm";
import AuthorityEmergencyRequests from "@/components/emergency/AuthorityEmergencyRequests";
import RescueTeamRequests from "@/components/emergency/RescueTeamRequests";

export default async function EmergencyPage() {
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

  const isAuthority =
    profile.role === "authority" ||
    profile.role === "admin";

  const isRescueTeam =
    profile.role === "rescue_team";

  const isCitizen =
    profile.role === "citizen";

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <DashboardHeader
        fullName={profile.full_name || "User"}
        role={profile.role}
      />

      <div className="flex min-h-[calc(100vh-73px)]">
        <DashboardSidebar role={profile.role} />

        <section className="min-w-0 flex-1">
          <div
            className={`mx-auto px-5 py-8 lg:px-8 ${
              isCitizen
                ? "max-w-4xl"
                : "max-w-7xl"
            }`}
          >
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <Siren size={22} />
                </div>

                <div>
                  <p className="text-sm font-medium text-red-400">
                    EMERGENCY RESPONSE
                  </p>

                  <h1 className="mt-1 text-3xl font-bold">
                    {isAuthority
                      ? "Emergency Control Center"
                      : isRescueTeam
                        ? "Assigned Emergency Requests"
                        : "Emergency Request"}
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8796A8]">
                {isAuthority
                  ? "Review incoming emergency requests, assign available rescue teams, and manage response status."
                  : isRescueTeam
                    ? "View emergency requests assigned to your rescue team and update response progress."
                    : "Request emergency assistance and provide your location so authorized responders can act on your request."}
              </p>
            </div>

            {isAuthority ? (
              <AuthorityEmergencyRequests />
            ) : isRescueTeam ? (
              <RescueTeamRequests />
            ) : (
              <EmergencyRequestForm />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}