"use client";

import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type DisasterReportFormProps = {
  userId: string;
};

const disasterTypes = [
  { value: "flood", label: "Flood" },
  { value: "earthquake", label: "Earthquake" },
  { value: "cyclone", label: "Cyclone" },
  { value: "landslide", label: "Landslide" },
  { value: "fire", label: "Fire" },
  { value: "industrial", label: "Industrial Accident" },
  { value: "building_collapse", label: "Building Collapse" },
  { value: "road_accident", label: "Road Accident" },
  { value: "other", label: "Other" },
];

export default function DisasterReportForm({
  userId,
}: DisasterReportFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [disasterType, setDisasterType] = useState("");
  const [description, setDescription] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const [files, setFiles] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  function getLocation() {
    setLocationMessage("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationMessage(
        "Location services are not supported by this browser."
      );
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        setLocationMessage(
          "Current location captured successfully."
        );

        setLocationLoading(false);
      },
      (locationError) => {
        if (locationError.code === 1) {
          setLocationMessage(
            "Location permission was denied. You can still submit the report without GPS."
          );
        } else if (locationError.code === 2) {
          setLocationMessage(
            "Your location could not be determined."
          );
        } else {
          setLocationMessage(
            "Location request timed out. Please try again."
          );
        }

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(event.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      return (
        file.type.startsWith("image/") ||
        file.type.startsWith("video/")
      );
    });

    if (validFiles.length > 3) {
      setFiles(validFiles.slice(0, 3));
      setError("You can upload a maximum of 3 files.");
      return;
    }

    setError("");
    setFiles(validFiles);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setAiMessage("");

    if (!disasterType) {
      setError("Please select the disaster type.");
      return;
    }

    if (description.trim().length < 10) {
      setError(
        "Please provide at least 10 characters describing the incident."
      );
      return;
    }

    setSubmitting(true);

    try {
      /*
       * STEP 1
       * Create the disaster report in Supabase.
       */
      const { data: report, error: reportError } =
        await supabase
          .from("disaster_reports")
          .insert({
            reporter_id: userId,
            disaster_type: disasterType,
            description: description.trim(),
            latitude,
            longitude,
            status: "reported",
          })
          .select("id")
          .single();

      if (reportError || !report) {
        throw new Error(
          reportError?.message ||
            "Unable to create the disaster report."
        );
      }

      /*
       * STEP 2
       * Upload photos/videos and save their database records.
       */
      for (const file of files) {
        const fileExtension =
          file.name.split(".").pop() || "file";

        const mediaType = file.type.startsWith("video/")
          ? "video"
          : "image";

        const filePath =
          `${userId}/${report.id}/${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } =
          await supabase.storage
            .from("disaster-media")
            .upload(filePath, file, {
              contentType: file.type,
              upsert: false,
            });

        if (uploadError) {
          console.error(
            "Media upload error:",
            uploadError
          );
          continue;
        }

        const { error: mediaRecordError } =
          await supabase
            .from("disaster_media")
            .insert({
              disaster_id: report.id,
              uploader_id: userId,
              file_url: filePath,
              file_type: mediaType,
            });

        if (mediaRecordError) {
          console.error(
            "Media record error:",
            mediaRecordError
          );
        }
      }

      /*
       * STEP 3
       * Automatically trigger AI analysis.
       *
       * The browser sends only the report ID.
       * The server API retrieves the report,
       * calls Gemini, and saves the AI result.
       */
      try {
        setAiMessage(
          "Report submitted. AI is analyzing the disaster..."
        );

        const aiResponse = await fetch(
          "/api/ai/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reportId: report.id,
            }),
          }
        );

        const aiData = await aiResponse.json();

        if (!aiResponse.ok || !aiData.success) {
          console.error(
            "AI analysis failed:",
            aiData
          );

          setAiMessage(
            "Report submitted successfully. AI analysis is still pending."
          );
        } else {
          const result = aiData.result;

          setAiMessage(
            `AI analysis completed: ${result.classification} • ${result.severity}`
          );
        }
      } catch (aiError) {
        console.error(
          "AI request error:",
          aiError
        );

        setAiMessage(
          "Report submitted successfully. AI analysis is still pending."
        );
      }

      /*
       * STEP 4
       * Show success and return to dashboard.
       */
      setSuccess(true);

      setDisasterType("");
      setDescription("");
      setLatitude(null);
      setLongitude(null);
      setLocationMessage("");
      setFiles([]);

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2500);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while submitting the report."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-[#203449] bg-[#0B1828] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Incident Information
          </h2>

          <p className="mt-1 text-sm text-[#718195]">
            Tell us what is happening.
          </p>
        </div>

        <div>
          <label
            htmlFor="disasterType"
            className="mb-2 block text-sm font-medium text-[#C6D0DB]"
          >
            Disaster type
          </label>

          <select
            id="disasterType"
            value={disasterType}
            onChange={(event) =>
              setDisasterType(event.target.value)
            }
            className="w-full rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none focus:border-red-400"
          >
            <option value="">
              Select disaster type
            </option>

            {disasterTypes.map((type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-[#C6D0DB]"
          >
            What happened?
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe the situation, damage, people affected, or immediate danger..."
            rows={6}
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-[#263B50] bg-[#07111F] px-4 py-3 text-white outline-none placeholder:text-[#536375] focus:border-red-400"
          />

          <p className="mt-2 text-right text-xs text-[#536579]">
            {description.length}/2000
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#203449] bg-[#0B1828] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Incident Location
          </h2>

          <p className="mt-1 text-sm text-[#718195]">
            GPS coordinates help authorities locate the incident.
          </p>
        </div>

        <button
          type="button"
          onClick={getLocation}
          disabled={locationLoading}
          className="flex items-center gap-2 rounded-xl border border-[#294057] bg-[#07111F] px-5 py-3 text-sm font-medium text-white transition hover:border-red-400 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locationLoading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <MapPin size={18} />
          )}

          {locationLoading
            ? "Getting location..."
            : "Use my current location"}
        </button>

        {locationMessage && (
          <p className="mt-4 text-sm text-[#8FA0B2]">
            {locationMessage}
          </p>
        )}

        {latitude !== null &&
          longitude !== null && (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex items-center gap-2 text-green-400">
                <MapPin size={17} />

                <span className="text-sm font-medium">
                  Location captured
                </span>
              </div>

              <p className="mt-2 text-xs text-[#718195]">
                Latitude: {latitude.toFixed(6)}
                <br />
                Longitude: {longitude.toFixed(6)}
              </p>
            </div>
          )}
      </section>

      <section className="rounded-2xl border border-[#203449] bg-[#0B1828] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Photos & Videos
          </h2>

          <p className="mt-1 text-sm text-[#718195]">
            Add up to 3 photos or videos showing the incident.
          </p>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#294057] bg-[#07111F] px-5 py-10 text-center transition hover:border-red-400">
          <Upload
            size={28}
            className="text-[#718195]"
          />

          <span className="mt-3 text-sm font-medium text-white">
            Choose photos or videos
          </span>

          <span className="mt-1 text-xs text-[#536579]">
            Images and videos only • Maximum 3 files
          </span>

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file) => (
              <div
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-3 rounded-xl border border-[#203449] bg-[#07111F] px-4 py-3"
              >
                {file.type.startsWith("video/") ? (
                  <Camera
                    size={18}
                    className="text-red-400"
                  />
                ) : (
                  <Upload
                    size={18}
                    className="text-red-400"
                  />
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm text-white">
                    {file.name}
                  </p>

                  <p className="text-xs text-[#536579]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4 text-sm text-green-300">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Disaster report submitted successfully.
              </p>

              {aiMessage && (
                <p className="mt-2 text-green-400/90">
                  {aiMessage}
                </p>
              )}

              <p className="mt-2 text-green-400/70">
                Returning to your dashboard...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-yellow-400"
          />

          <p className="text-sm leading-6 text-[#9FAAB8]">
            Only submit genuine emergency or disaster information.
            AI-based disaster classification and severity analysis
            will automatically process this report after submission.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || success}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-4 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && (
          <Loader2
            size={19}
            className="animate-spin"
          />
        )}

        {submitting
          ? "Submitting & analyzing..."
          : "Submit Disaster Report"}
      </button>
    </form>
  );
}