import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeDisaster } from "@/lib/ai/analyzeDisaster";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to analyze a disaster report.",
        },
        { status: 401 }
      );
    }

    // Read request body
    const body = await request.json();

    const { reportId } = body;

    if (!reportId) {
      return NextResponse.json(
        {
          success: false,
          error: "reportId is required.",
        },
        { status: 400 }
      );
    }

    // Get the user's disaster report
    const { data: report, error: reportError } = await supabase
      .from("disaster_reports")
      .select(
        "id, reporter_id, disaster_type, description, latitude, longitude"
      )
      .eq("id", reportId)
      .eq("reporter_id", user.id)
      .single();

    if (reportError || !report) {
      console.error("REPORT FETCH ERROR:", reportError);

      return NextResponse.json(
        {
          success: false,
          error: "Disaster report not found or access denied.",
        },
        { status: 404 }
      );
    }

    // Mark AI processing as started
    await supabase
      .from("disaster_reports")
      .update({
        ai_status: "processing",
      })
      .eq("id", report.id)
      .eq("reporter_id", user.id);

    // Send report to Gemini
    const aiResult = await analyzeDisaster({
      reportedType: report.disaster_type,
      description: report.description,
      latitude: report.latitude,
      longitude: report.longitude,
    });

    // Save AI result
    const { error: updateError } = await supabase
      .from("disaster_reports")
      .update({
        ai_classification: aiResult.classification,
        ai_severity: aiResult.severity,
        ai_confidence: aiResult.confidence,
        ai_analysis: aiResult.analysis,
        ai_status: "completed",
        ai_processed_at: new Date().toISOString(),
      })
      .eq("id", report.id)
      .eq("reporter_id", user.id);

    if (updateError) {
      console.error("AI RESULT UPDATE ERROR:", updateError);

      return NextResponse.json(
        {
          success: false,
          error: "AI analysis completed, but the result could not be saved.",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reportId: report.id,
      result: aiResult,
    });
  } catch (error) {
    console.error("AI ANALYSIS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "AI disaster analysis failed.",
      },
      { status: 500 }
    );
  }
}