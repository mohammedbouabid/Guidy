import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, UsersIcon } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
};

export default function PackDetails({ pack }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-[#05073c] mb-4">
          Tour Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CalendarIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#05073c]">Start Date</p>
              <p className="text-sm text-[#717171]">{formatDate(pack.startDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#05073c]">End Date</p>
              <p className="text-sm text-[#717171]">{formatDate(pack.endDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ClockIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#05073c]">Duration</p>
              <p className="text-sm text-[#717171]">
                {calculateDuration(pack.startDate, pack.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UsersIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#05073c]">Max Clients</p>
              <p className="text-sm text-[#717171]">
                {pack.maxClients || "N/A"} people
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}