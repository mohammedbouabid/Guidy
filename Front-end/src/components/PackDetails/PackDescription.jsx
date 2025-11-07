import React from "react";
import { Card, CardContent } from "@/components/ui/components/ui/card";

export default function PackDescription({ description }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-[#05073c] mb-4">
          About This Tour
        </h2>
        <p className="text-[#717171] leading-relaxed whitespace-pre-line">
          {description || "No description available."}
        </p>
      </CardContent>
    </Card>
  );
}