"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";

type Disaster = {
  id: string;
  disaster_type: string;
  latitude: number;
  longitude: number;
  ai_classification: string | null;
  ai_severity: string | null;
  created_at: string;
};

type DisasterMapClientProps = {
  disasters: Disaster[];
};

const defaultCenter: [number, number] = [
  16.241007,
  80.616761,
];

function createMarkerIcon(severity: string | null) {
  const normalized = severity?.toLowerCase();

  let color = "#60A5FA";

  if (normalized === "critical") {
    color = "#EF4444";
  } else if (normalized === "high") {
    color = "#F97316";
  } else if (normalized === "moderate") {
    color = "#EAB308";
  } else if (normalized === "low") {
    color = "#22C55E";
  }

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 0 12px ${color};
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

function MapCenter({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 12);
  }, [latitude, longitude, map]);

  return null;
}

export default function DisasterMapClient({
  disasters,
}: DisasterMapClientProps) {
  const [userLocation, setUserLocation] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      () => {
        // User may deny location permission.
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const center =
    userLocation ||
    (disasters.length > 0
      ? [disasters[0].latitude, disasters[0].longitude]
      : defaultCenter);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-[#203449]">
      <MapContainer
        center={center as [number, number]}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {disasters.map((disaster) => {
          const severity =
            disaster.ai_severity?.toLowerCase() || "unknown";

          return (
            <div key={disaster.id}>
              <Marker
                position={[
                  disaster.latitude,
                  disaster.longitude,
                ]}
                icon={createMarkerIcon(
                  disaster.ai_severity
                )}
              >
                <Popup>
                  <div className="min-w-[190px] text-sm">
                    <p className="font-bold capitalize">
                      {disaster.disaster_type.replace(
                        /_/g,
                        " "
                      )}
                    </p>

                    <p className="mt-1">
                      AI Classification:{" "}
                      <strong className="capitalize">
                        {(
                          disaster.ai_classification ||
                          "pending"
                        ).replace(/_/g, " ")}
                      </strong>
                    </p>

                    <p className="mt-1">
                      Severity:{" "}
                      <strong className="capitalize">
                        {severity}
                      </strong>
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        disaster.created_at
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {disaster.ai_severity &&
                ["high", "critical"].includes(severity) && (
                  <Circle
                    center={[
                      disaster.latitude,
                      disaster.longitude,
                    ]}
                    radius={1500}
                    pathOptions={{
                      color:
                        severity === "critical"
                          ? "#EF4444"
                          : "#F97316",
                      fillOpacity: 0.08,
                    }}
                  />
                )}
            </div>
          );
        })}

        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={250}
              pathOptions={{
                color: "#38BDF8",
                fillColor: "#38BDF8",
                fillOpacity: 0.18,
              }}
            />

            <Marker position={userLocation}>
              <Popup>
                <strong>Your current location</strong>
              </Popup>
            </Marker>

            <MapCenter
              latitude={userLocation[0]}
              longitude={userLocation[1]}
            />
          </>
        )}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-[#294057] bg-[#07111F]/95 px-4 py-3 shadow-xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#718195]">
          Disaster Severity
        </p>

        <div className="mt-2 flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Critical
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            High
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            Moderate
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Low
          </span>
        </div>
      </div>
    </div>
  );
}