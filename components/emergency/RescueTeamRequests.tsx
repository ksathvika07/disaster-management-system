"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Siren,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type RequestStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

type EmergencyRequest = {
  id: string;
  request_type: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  priority: "low" | "medium" | "high" | "critical";
  status: RequestStatus;
  created_at: string;
};

type RescueTeam = {
  id: string;
  team_name: string;
  specialization: string | null;
};

export default function RescueTeamRequests() {
  const supabase = createClient();

  const [requests, setRequests] = useState<
    EmergencyRequest[]
  >([]);

  const [team, setTeam] =
    useState<RescueTeam | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMessage("");

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage(
        "Your session could not be found."
      );
      setLoading(false);
      return;
    }

    const { data: teamData, error: teamError } =
      await supabase
        .from("rescue_teams")
        .select(
          "id, team_name, specialization"
        )
        .eq("user_id", user.id)
        .single();

    if (teamError || !teamData) {
      console.error(
        "RESCUE TEAM LOAD ERROR:",
        teamError
      );

      setErrorMessage(
        "No rescue team is linked to this account."
      );

      setLoading(false);
      return;
    }

    setTeam(teamData as RescueTeam);

    const {
      data: requestData,
      error: requestError,
    } = await supabase
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
      .eq("assigned_team_id", teamData.id)
      .order("created_at", {
        ascending: false,
      });

    if (requestError) {
      console.error(
        "ASSIGNED REQUESTS LOAD ERROR:",
        requestError
      );

      setErrorMessage(
        requestError.message
      );
    }

    if (requestData) {
      setRequests(
        requestData as EmergencyRequest[]
      );
    }

    setLoading(false);
  }

  async function refreshData() {
    setRefreshing(true);
    setMessage("");
    setErrorMessage("");

    await loadData();

    setRefreshing(false);
  }

  async function updateStatus(
    requestId: string,
    status: RequestStatus
  ) {
    setUpdatingId(requestId);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("emergency_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      setErrorMessage(error.message);
      setUpdatingId(null);
      return;
    }

    setMessage(
      "Emergency request status updated."
    );

    await loadData();

    setUpdatingId(null);
  }

  const activeRequests = requests.filter(
    (request) =>
      request.status !== "completed" &&
      request.status !== "cancelled"
  ).length;

  const criticalRequests = requests.filter(
    (request) =>
      request.priority === "critical" &&
      request.status !== "completed" &&
      request.status !== "cancelled"
  ).length;

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#203449] bg-[#0B1828] p-8 text-center">
        <RefreshCw
          size={24}
          className="mx-auto animate-spin text-red-400"
        />

        <p className="mt-3 text-sm text-[#718195]">
          Loading assigned requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {team && (
        <section className="rounded-2xl border border-[#203449] bg-[#0B1828] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Users size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#657589]">
                  Assigned Rescue Team
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {team.team_name}
                </h2>

                {team.specialization && (
                  <p className="mt-1 text-sm text-[#718195]">
                    {team.specialization}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#294057] bg-[#07111F] px-4 py-2.5 text-sm font-medium text-white transition hover:border-red-400 hover:text-red-400 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard
          icon={<Siren size={20} />}
          label="Active Assigned Requests"
          value={activeRequests}
        />

        <SummaryCard
          icon={<AlertTriangle size={20} />}
          label="Critical Requests"
          value={criticalRequests}
        />
      </div>

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-green-400"
          />

          <p className="text-sm text-green-300">
            {message}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <p className="text-sm leading-6 text-red-300">
            {errorMessage}
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-[#203449] bg-[#0B1828]">
        <div className="border-b border-[#203449] p-6">
          <div className="flex items-center gap-3">
            <Siren
              size={21}
              className="text-red-400"
            />

            <div>
              <h2 className="font-semibold">
                Assigned Emergency Requests
              </h2>

              <p className="mt-1 text-sm text-[#718195]">
                Respond to emergencies assigned to
                your team.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {requests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#294057] bg-[#07111F] p-10 text-center">
              <Siren
                size={30}
                className="mx-auto text-[#536579]"
              />

              <p className="mt-3 font-medium text-[#AAB6C4]">
                No assigned requests
              </p>

              <p className="mt-1 text-sm text-[#657589]">
                New requests assigned to your team
                will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const isUpdating =
                  updatingId === request.id;

                return (
                  <div
                    key={request.id}
                    className="rounded-xl border border-[#203449] bg-[#07111F] p-5"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold capitalize">
                              {request.request_type}
                            </span>

                            <PriorityBadge
                              priority={
                                request.priority
                              }
                            />

                            <StatusBadge
                              status={
                                request.status
                              }
                            />
                          </div>

                          {request.description && (
                            <p className="mt-3 text-sm leading-6 text-[#8F9CAC]">
                              {request.description}
                            </p>
                          )}

                          <div className="mt-4 space-y-2">
                            {request.location_name && (
                              <div className="flex items-center gap-2 text-sm text-[#718195]">
                                <MapPin
                                  size={15}
                                />

                                <span>
                                  {
                                    request.location_name
                                  }
                                </span>
                              </div>
                            )}

                            {request.latitude !==
                              null &&
                              request.longitude !==
                                null && (
                                <p className="text-xs text-[#536579]">
                                  GPS:{" "}
                                  {request.latitude.toFixed(
                                    5
                                  )}
                                  ,{" "}
                                  {request.longitude.toFixed(
                                    5
                                  )}
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#536579]">
                          <Clock3 size={13} />

                          {new Intl.DateTimeFormat(
                            "en-IN",
                            {
                              dateStyle:
                                "medium",
                              timeStyle:
                                "short",
                            }
                          ).format(
                            new Date(
                              request.created_at
                            )
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[#203449] pt-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#657589]">
                          Response status
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <StatusButton
                            label="Start Response"
                            active={
                              request.status ===
                              "in_progress"
                            }
                            disabled={
                              isUpdating ||
                              request.status ===
                                "completed" ||
                              request.status ===
                                "cancelled"
                            }
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "in_progress"
                              )
                            }
                          />

                          <StatusButton
                            label="Mark Completed"
                            active={
                              request.status ===
                              "completed"
                            }
                            disabled={
                              isUpdating ||
                              request.status ===
                                "cancelled"
                            }
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "completed"
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#203449] bg-[#0B1828] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          {icon}
        </div>

        <span className="text-2xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm text-[#8291A3]">
        {label}
      </p>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: EmergencyRequest["priority"];
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

function StatusButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border px-4 py-2.5 text-xs font-medium transition ${
        active
          ? "border-red-400 bg-red-500/10 text-red-400"
          : "border-[#294057] bg-[#0B1828] text-[#AAB6C4] hover:border-red-400 hover:text-red-400"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}