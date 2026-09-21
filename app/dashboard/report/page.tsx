import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DisasterReportForm from "@/components/disaster/DisasterReportForm";

export default async function ReportDisasterPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={23} />
            </div>

            <div>
              <p className="text-sm font-medium text-red-400">
                EMERGENCY REPORTING
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Report a Disaster
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl leading-7 text-[#8796A8]">
            Provide accurate information about the incident. Your
            location and report will be securely stored and made
            available to authorized disaster-response personnel.
          </p>
        </div>

        <DisasterReportForm userId={user.id} />
      </div>
    </main>
  );
}