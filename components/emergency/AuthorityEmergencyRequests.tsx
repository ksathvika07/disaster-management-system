"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Send,
  Siren,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Priority =
  | "low"
  | "medium"
  | "high"
  | "critical";

type RequestStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

type EmergencyRequest = {
  id: string;
  requested_by: string;
  request_type: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  priority: Priority;
  status: RequestStatus;
  assigned_team_id: string | null;
  created_at: string;
};

type RescueTeam = {
  id: string;
  team_name: string;
  specialization: string | null;
  is_available: boolean;
};

export default function AuthorityEmergencyRequests() {
  const supabase = createClient();

  const [requests, setRequests] = useState<
    EmergencyRequest[]
  >([]);

  const [teams, setTeams] = useState<RescueTeam[]>(
    []
  );

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

    const [
      requestsResult,
      teamsResult,
    ] = await Promise.all([
      supabase
        .from("emergency_requests")
        .select(
          `
            id,
            requested_by,
            request_type,
            description,
            latitude,
            longitude,
            location_name,
            priority,
            status,
            assigned_team_id,
            created_at
          `
        )
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("rescue_teams")
        .select(
          "id, team_name, specialization, is_available"
        )
        .order("team_name"),
    ]);

    if (requestsResult.error) {
      console.error(
        "REQUESTS LOAD ERROR:",
        requestsResult.error
      );

      setErrorMessage(
        requestsResult.error.message
      );
    }

    if (teamsResult.error) {
      console.error(
        "TEAMS LOAD ERROR:",
        teamsResult.error
      );

      setErrorMessage(
        teamsResult.error.message
      );
    }

    if (requestsResult.data) {
      setRequests(
        requestsResult.data as EmergencyRequest[]
      );
    }

    if (teamsResult.data) {
      setTeams(
        teamsResult.data as RescueTeam[]
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

  async function updateRequest(
    requestId: string,
    updates: Partial<EmergencyRequest>
  ) {
    setUpdatingId(requestId);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("emergency_requests")
      .update(updates)
      .eq("id", requestId);

    if (error) {
      console.error(
        "REQUEST UPDATE ERROR:",
        error
      );

      setErrorMessage(error.message);
      setUpdatingId(null);
      return;
    }

    setMessage(
      "Emergency request updated successfully."
    );

    await loadData();

    setUpdatingId(null);
  }

  async function assignTeam(
    request: EmergencyRequest,
    teamId: string
  ) {
    if (!teamId) {
      return;
    }

    await updateRequest(request.id, {
      assigned_team_id: teamId,
      status:
        request.status === "pending"
          ? "assigned"
          : request.status,
    });
  }

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const criticalCount = requests.filter(
    (request) =>
      request.priority === "critical" &&
      request.status !== "completed" &&
      request.status !== "cancelled"
  ).length;

  const availableTeams = teams.filter(
    (team) => team.is_available
  ).length;

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#203449] bg-[#0B1828] p-8 text-center">
        <RefreshCw
          size={24}
          className="mx-auto animate-spin text-red-400"
        />

        <p className="mt-3 text-sm text-[#718195]">
          Loading emergency requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Siren size={20} />}
          label="Pending Requests"
          value={pendingCount}
        />

        <SummaryCard
          icon={<AlertTriangle size={20} />}
          label="Critical Requests"
          value={criticalCount}
        />

        <SummaryCard
          icon={<Users size={20} />}
          label="Available Teams"
          value={availableTeams}
        />
      </div>

      <section className="rounded-2xl border border-[#203449] bg-[#0B1828]">
        <div className="flex flex-col gap-4 border-b border-[#203449] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Siren
                size={21}
                className="text-red-400"
              />

              <h2 className="font-semibold">
                Emergency Requests
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#718195]">
              Review incoming requests and assign
              available rescue teams.
            </p>
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

        {message && (
          <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
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
          <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <p className="text-sm leading-6 text-red-300">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="p-6">
          {requests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#294057] bg-[#07111F] p-10 text-center">
              <Siren
                size={30}
                className="mx-auto text-[#536579]"
              />

              <p className="mt-3 font-medium text-[#AAB6C4]">
                No emergency requests
              </p>

              <p className="mt-1 text-sm text-[#657589]">
                New citizen requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const assignedTeam =
                  teams.find(
                    (team) =>
                      team.id ===
                      request.assigned_team_id
                  );

                const isUpdating =
                  updatingId === request.id;

                return (
                  <div
                    key={request.id}
                    className="rounded-xl border border-[#203449] bg-[#07111F] p-5"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
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

                          <div className="mt-4 space-y-1">
                            {request.location_name && (
                              <div className="flex items-center gap-2 text-xs text-[#718195]">
                                <MapPin
                                  size={14}
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

                        <div className="shrink-0 text-xs text-[#536579]">
                          <div className="flex items-center gap-1.5">
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
                      </div>

                      <div className="border-t border-[#203449] pt-4">
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                          <div>
                            <label
                              htmlFor={`team-${request.id}`}
                              className="text-xs font-semibold uppercase tracking-wider text-[#657589]"
                            >
                              Assign rescue team
                            </label>

                            <select
                              id={`team-${request.id}`}
                              value={
                                request.assigned_team_id ||
                                ""
                              }
                              onChange={(event) =>
                                assignTeam(
                                  request,
                                  event.target.value
                                )
                              }
                              disabled={
                                isUpdating
                              }
                              className="mt-2 w-full rounded-xl border border-[#294057] bg-[#0B1828] px-4 py-3 text-sm text-white outline-none focus:border-red-400 disabled:opacity-60"
                            >
                              <option value="">
                                Select a rescue team
                              </option>

                              {teams.map((team) => (
                                <option
                                  key={team.id}
                                  value={team.id}
                                  disabled={
                                    !team.is_available &&
                                    team.id !==
                                      request.assigned_team_id
                                  }
                                >
                                  {team.team_name}
                                  {team.specialization
                                    ? ` — ${team.specialization}`
                                    : ""}
                                  {!team.is_available
                                    ? " — Unavailable"
                                    : " — Available"}
                                </option>
                              ))}
                            </select>

                            {assignedTeam && (
                              <p className="mt-2 text-xs text-green-400">
                                Assigned to{" "}
                                {
                                  assignedTeam.team_name
                                }
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <StatusButton
                              label="Acknowledge"
                              active={
                                request.status ===
                                "assigned"
                              }
                              disabled={
                                isUpdating ||
                                request.status ===
                                  "completed" ||
                                request.status ===
                                  "cancelled"
                              }
                              onClick={() =>
                                updateRequest(
                                  request.id,
                                  {
                                    status:
                                      "assigned",
                                  }
                                )
                              }
                            />

                            <StatusButton
                              label="In Progress"
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
                                updateRequest(
                                  request.id,
                                  {
                                    status:
                                      "in_progress",
                                  }
                                )
                              }
                            />

                            <StatusButton
                              label="Complete"
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
                                updateRequest(
                                  request.id,
                                  {
                                    status:
                                      "completed",
                                  }
                                )
                              }
                            />
                          </div>
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
      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
        active
          ? "border-red-400 bg-red-500/10 text-red-400"
          : "border-[#294057] bg-[#0B1828] text-[#AAB6C4] hover:border-red-400 hover:text-red-400"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}