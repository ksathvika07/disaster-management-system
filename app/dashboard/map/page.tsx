import { redirect } from "next/navigation";
import { MapPin, Radio } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DisasterMap from "@/components/map/DisasterMap";

type Disaster = {
  id: string;
  disaster_type: string;
  latitude: number;
  longitude: number;
  ai_classification: string | null;
  ai_severity: string | null;
  created_at: string;
};

export default async function LiveMapPage() {
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

  const { data: disasters } = await supabase
    .from("disaster_reports")
    .select(
      `
        id,
        disaster_type,
        latitude,
        longitude,
        ai_classification,
        ai_severity,
        created_at
      `
    )
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("created_at", { ascending: false });

  const validDisasters: Disaster[] = (disasters ?? []).filter(
    (disaster) =>
      disaster.latitude !== null &&
      disaster.longitude !== null
  ) as Disaster[];

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <DashboardHeader
        fullName={profile.full_name || "User"}
        role={profile.role}
      />

      <div className="flex min-h-[calc(100vh-73px)]">
        <DashboardSidebar role={profile.role} />

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
            {/* Page heading */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <MapPin size={22} />
                </div>

                <div>
                  <p className="text-sm font-medium text-red-400">
                    REAL-TIME LOCATION
                  </p>

                  <h1 className="mt-1 text-3xl font-bold">
                    Live Disaster Map
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#8796A8]">
                View disaster reports with GPS coordinates,
                AI classification, and severity information on
                the live response map.
              </p>
            </div>

            {/* Status cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#203449] bg-[#0B1A2B] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Radio size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#718195]">
                      GPS Reports
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {validDisasters.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#203449] bg-[#0B1A2B] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#718195]">
                      Map Status
                    </p>

                    <p className="mt-1 text-lg font-semibold text-green-400">
                      Live
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl border border-[#203449] bg-[#0B1A2B] p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Disaster Locations
                  </h2>

                  <p className="mt-1 text-sm text-[#718195]">
                    Select a marker to view disaster and AI
                    assessment details.
                  </p>
                </div>

                <span className="hidden rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 sm:block">
                  ● Live Data
                </span>
              </div>

              <DisasterMap disasters={validDisasters} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}