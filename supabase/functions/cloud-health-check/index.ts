import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (_req, _ctx) => {
      return Response.json({
        success: true,
        service: "cloud-health-check",
        platform: "Supabase Edge Functions",
        status: "operational",
        timestamp: new Date().toISOString(),
      });
    }
  ),
};