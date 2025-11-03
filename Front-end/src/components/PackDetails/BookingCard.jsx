import React from "react";
import { Card, CardContent } from "@/components/ui/components/ui/card";
import { Button } from "@/components/ui/components/ui/button";

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
};

export default function BookingCard({ pack }) {
  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        {/* Price + Availability */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-[#05073c]">
              ${pack.price}
            </span>
            <span className="text-sm text-[#717171]">per person</span>
          </div>

          {pack.availability && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600">Available</span>
            </div>
          )}
        </div>

        {/* Quick Facts */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#717171]">Duration:</span>
            <span className="font-medium text-[#05073c]">
              {calculateDuration(pack.startDate, pack.endDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#717171]">Max Group Size:</span>
            <span className="font-medium text-[#05073c]">
              {pack.maxClients} people
            </span>
          </div>
        </div>

        {/* CTA */}
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          size="lg"
          onClick={() => {
            // Placeholder for booking logic
            console.log("Book now clicked for pack:", pack._id);
            alert("Booking functionality will be implemented soon!");
          }}
        >
          Book Now
        </Button>

        <p className="text-xs text-center text-[#717171] mt-4">
          You won't be charged yet
        </p>
      </CardContent>
    </Card>
  );
}