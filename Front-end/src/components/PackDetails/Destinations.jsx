import React from "react";
import { Card, CardContent } from "@/components/ui/components/ui/card";

export default function Destinations({ places }) {
  if (!places || places.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-[#05073c] mb-4">
          Destinations Included
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {places.map((place, index) => (
            <div
              key={place._id || index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {place.images && place.images[0] && (
                <img
                  src={place.images[0]}
                  alt={place.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium text-[#05073c]">{place.name}</p>
                <p className="text-sm text-[#717171]">
                  {place.city}, {place.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}