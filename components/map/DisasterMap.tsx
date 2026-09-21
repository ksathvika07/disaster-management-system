"use client";

import dynamic from "next/dynamic";

const DisasterMapClient = dynamic(
  () => import("./DisasterMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-[#203449] bg-[#07111F]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#294057] border-t-red-400" />

          <p className="mt-3 text-sm text-[#718195]">
            Loading disaster map...
          </p>
        </div>
      </div>
    ),
  }
);

type Disaster = {
  id: string;
  disaster_type: string;
  latitude: number;
  longitude: number;
  ai_classification: string | null;
  ai_severity: string | null;
  created_at: string;
};

type DisasterMapProps = {
  disasters: Disaster[];
};

export default function DisasterMap({
  disasters,
}: DisasterMapProps) {
  return <DisasterMapClient disasters={disasters} />;
}