import React from "react";
import { MapPinIcon, StarIcon } from "lucide-react";

export default function PackHeader({ pack }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#05073c] mb-3">{pack.title}</h1>

      <div className="flex items-center gap-4 mb-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`w-5 h-5 ${
                  typeof pack.avgRating === "number" &&
                  index < Math.round(pack.avgRating)
                    ? "fill-[#e2ad64] text-[#e2ad64]"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-[#05073c]">
            {typeof pack.avgRating === "number"
              ? pack.avgRating.toFixed(1)
              : "No ratings yet"}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-[#717171]">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm">
            {pack.startLocation} → {pack.endLocation}
          </span>
        </div>
      </div>
    </div>
  );
}