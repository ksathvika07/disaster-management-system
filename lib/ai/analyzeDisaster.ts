import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export type DisasterAIResult = {
  classification: string;
  severity: "low" | "moderate" | "high" | "critical";
  confidence: number;
  analysis: string;
};

const allowedDisasterTypes = [
  "flood",
  "earthquake",
  "cyclone",
  "landslide",
  "fire",
  "industrial",
  "building_collapse",
  "road_accident",
  "other",
];

export async function analyzeDisaster(input: {
  reportedType: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
}): Promise<DisasterAIResult> {
  const prompt = `
You are an AI disaster analysis system for a disaster management platform.

Analyze the following disaster report.

USER-REPORTED DISASTER TYPE:
${input.reportedType}

DESCRIPTION:
${input.description}

LOCATION:
Latitude: ${input.latitude ?? "unknown"}
Longitude: ${input.longitude ?? "unknown"}

Your task:

1. Determine the most likely disaster classification.
2. Determine the severity.
3. Give a confidence score between 0 and 1.
4. Give a concise explanation of your assessment.

Allowed disaster classifications:
${allowedDisasterTypes.join(", ")}

Allowed severity values:
low, moderate, high, critical

Return ONLY valid JSON in exactly this structure:

{
  "classification": "flood",
  "severity": "high",
  "confidence": 0.92,
  "analysis": "Brief explanation"
}

Do not include markdown.
Do not include additional fields.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("AI returned an empty response.");
  }

  let result: DisasterAIResult;

  try {
    result = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON.");
  }

  if (!allowedDisasterTypes.includes(result.classification)) {
    result.classification = "other";
  }

  const allowedSeverities = ["low", "moderate", "high", "critical"];

  if (!allowedSeverities.includes(result.severity)) {
    result.severity = "moderate";
  }

  if (
    typeof result.confidence !== "number" ||
    Number.isNaN(result.confidence)
  ) {
    result.confidence = 0;
  }

  result.confidence = Math.max(0, Math.min(1, result.confidence));

  if (typeof result.analysis !== "string") {
    result.analysis = "AI analysis was completed.";
  }

  return result;
}