"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Droplets,
  HeartPulse,
  Home,
  MapPin,
  Package,
  Send,
  ShieldAlert,
  Siren,
  Utensils,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type RequestType =
  | "rescue"
  | "medical"
  | "food"
  | "water"
  | "shelter";

type Priority = "low" | "medium" | "high" | "critical";

type RequestStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

type EmergencyRequest = {
  id: string;
  request_type: RequestType;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  priority: Priority;
  status: RequestStatus;
  created_at: string;
};

const requestTypes: {
  value: RequestType;
  label: string;
  description: string;
  icon: typeof Siren;
}[] = [
  {
    value: "rescue",
    label: "Rescue",
    description: "Immediate rescue or evacuation",
    icon: Siren,
  },
  {
    value: "medical",
    label: "Medical",
    description: "Medical assistance or first aid",
    icon: HeartPulse,
  },
  {
    value: "food",
    label: "Food",
    description: "Food or essential supplies",
    icon: Utensils,
  },
  {
    value: "water",
    label: "Water",
    description: "Drinking water requirement",
    icon: Droplets,
  },
  {
    value: "shelter",
    label: "Shelter",
    description: "Safe temporary shelter",
    icon: Home,
  },
];

const priorities: {
  value: Priority;
  label: string;
}[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export default function EmergencyRequestForm() {
  const supabase = createClient();

  const [requestType, setRequestType] =
    useState<RequestType>("rescue");

  const [priority, setPriority] =
    useState<Priority>("medium");

  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationMessage, setLocationMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [requests, setRequests] = useState<
    EmergencyRequest[]
  >([]);

  const [loadingRequests, setLoadingRequests] =
    useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoadingRequests(true);

    const { data, error } = await supabase
      .from("emergency_requests")
      .select(
        `
          id,
          request_type,
          description,
          latitude,
          longitude,
          location_name,
          priority,
          status,
          created_at
        `
      )
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setRequests(data as EmergencyRequest[]);
    }

    setLoadingRequests(false);
  }

  function getLocation() {
    setLocationMessage("");
    setErrorMessage("");
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
      (error) => {
        if (error.code === 1) {
          setLocationMessage(
            "Location permission was denied. You can still submit the request without GPS."
          );
        } else if (error.code === 2) {
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
        maximumAge: 60000,
      }
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!description.trim()) {
      setErrorMessage(
        "Please describe the assistance you need."
      );
      setSubmitting(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage(
        "Your session has expired. Please log in again."
      );
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("emergency_requests")
      .insert({
        requested_by: user.id,
        request_type: requestType,
        description: description.trim(),
        latitude,
        longitude,
        location_name:
          locationName.trim() || null,
        priority,
        status: "pending",
      });

    if (error) {
      console.error(
        "EMERGENCY REQUEST ERROR:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to submit emergency request."
      );

      setSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Emergency request submitted successfully."
    );

    setDescription("");
    setLocationName("");
    setLatitude(null);
    setLongitude(null);
    setPriority("medium");
    setRequestType("rescue");
    setLocationMessage("");

    await loadRequests();

    setSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[#203449] bg-[#0B1828] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <Siren size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Request Emergency Assistance
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#718195]">
              Send a request for rescue, medical assistance,
              food, water, or shelter.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-6"
        >
          <div>
            <label className="text-sm font-medium text-white">
              Assistance required
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {requestTypes.map((item) => {
                const Icon = item.icon;
                const selected =
                  requestType === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setRequestType(item.value)
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-red-400 bg-red-500/10"
                        : "border-[#203449] bg-[#07111F] hover:border-[#35506B]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={19}
                        className={
                          selected
                            ? "text-red-400"
                            : "text-[#718195]"
                        }
                      />

                      <span className="font-medium">
                        {item.label}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#657589]">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="text-sm font-medium text-white"
            >
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as Priority
                )
              }
              className="mt-2 w-full rounded-xl border border-[#294057] bg-[#07111F] px-4 py-3 text-sm text-white outline-none focus:border-red-400"
            >
              {priorities.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-white"
            >
              Describe the emergency
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={5}
              placeholder="Describe what happened and what assistance you need..."
              className="mt-2 w-full resize-none rounded-xl border border-[#294057] bg-[#07111F] px-4 py-3 text-sm text-white placeholder:text-[#536579] outline-none focus:border-red-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="locationName"
              className="text-sm font-medium text-white"
            >
              Location name
              <span className="ml-2 text-xs font-normal text-[#536579]">
                Optional
              </span>
            </label>

            <input
              id="locationName"
              type="text"
              value={locationName}
              onChange={(event) =>
                setLocationName(event.target.value)
              }
              placeholder="Example: Near main road, village name..."
              className="mt-2 w-full rounded-xl border border-[#294057] bg-[#07111F] px-4 py-3 text-sm text-white placeholder:text-[#536579] outline-none focus:border-red-400"
            />
          </div>

          <div className="rounded-xl border border-[#203449] bg-[#07111F] p-5">
            <div className="flex items-start gap-3">
              <MapPin
                size={20}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  Emergency location
                </p>

                <p className="mt-1 text-sm leading-5 text-[#718195]">
                  Capture your current GPS coordinates so
                  responders can locate you.
                </p>

                <button
                  type="button"
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="mt-4 rounded-lg border border-[#294057] bg-[#0B1828] px-4 py-2.5 text-sm font-medium text-white transition hover:border-red-400 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading
                    ? "Getting location..."
                    : "Use my current location"}
                </button>

                {locationMessage && (
                  <p className="mt-3 text-xs leading-5 text-[#8A99AA]">
                    {locationMessage}
                  </p>
                )}

                {latitude !== null &&
                  longitude !== null && (
                    <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                      <p className="text-xs font-medium text-green-400">
                        Location captured
                      </p>

                      <p className="mt-1 text-xs text-[#718195]">
                        Latitude:{" "}
                        {latitude.toFixed(6)}
                      </p>

                      <p className="text-xs text-[#718195]">
                        Longitude:{" "}
                        {longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <AlertTriangle
                size={19}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <p className="text-sm leading-6 text-red-300">
                {errorMessage}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-green-400"
              />

              <p className="text-sm leading-6 text-green-300">
                {successMessage}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />

            {submitting
              ? "Submitting request..."
              : "Submit Emergency Request"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#203449] bg-[#0B1828] p-6">
        <div className="flex items-center gap-3">
          <Clock3
            size={20}
            className="text-red-400"
          />

          <div>
            <h2 className="font-semibold">
              Your Emergency Requests
            </h2>

            <p className="mt-1 text-sm text-[#718195]">
              Track the requests you have submitted.
            </p>
          </div>
        </div>

        <div className="mt-5">
          {loadingRequests ? (
            <div className="rounded-xl border border-[#203449] bg-[#07111F] p-5 text-sm text-[#718195]">
              Loading your requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#294057] bg-[#07111F] p-8 text-center">
              <ShieldAlert
                size={30}
                className="mx-auto text-[#536579]"
              />

              <p className="mt-3 font-medium text-[#AAB6C4]">
                No emergency requests
              </p>

              <p className="mt-1 text-sm text-[#657589]">
                Your submitted requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function RequestCard({
  request,
}: {
  request: EmergencyRequest;
}) {
  return (
    <div className="rounded-xl border border-[#203449] bg-[#07111F] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold capitalize">
              {request.request_type}
            </span>

            <PriorityBadge
              priority={request.priority}
            />

            <StatusBadge
              status={request.status}
            />
          </div>

          {request.description && (
            <p className="mt-3 text-sm leading-6 text-[#8F9CAC]">
              {request.description}
            </p>
          )}

          {request.location_name && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#657589]">
              <MapPin size={14} />

              <span>{request.location_name}</span>
            </div>
          )}

          {request.latitude !== null &&
            request.longitude !== null && (
              <p className="mt-1 text-xs text-[#536579]">
                GPS: {request.latitude.toFixed(5)},{" "}
                {request.longitude.toFixed(5)}
              </p>
            )}
        </div>

        <p className="shrink-0 text-xs text-[#536579]">
          {new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(request.created_at))}
        </p>
      </div>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: Priority;
}) {
  const classes = {
    low: "bg-green-500/10 text-green-400 border-green-500/20",
    medium:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    critical:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${classes[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: RequestStatus;
}) {
  const classes = {
    pending:
      "bg-[#294057]/40 text-[#AAB6C4] border-[#294057]",
    assigned:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    in_progress:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    completed:
      "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${classes[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}