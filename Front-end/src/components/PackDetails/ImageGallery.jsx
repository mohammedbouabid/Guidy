import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/components/ui/card";

export default function ImageGallery({ cover, images = [], altPrefix = "Pack" }) {
  // Build deduplicated gallery array
  const galleryImages = useMemo(() => {
    const allImages = [cover, ...images].filter(Boolean);
    return [...new Set(allImages)];
  }, [cover, images]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle empty state
  if (galleryImages.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">No images available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentImage = galleryImages[selectedIndex];

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        {/* Main Image */}
        <div className="relative w-full aspect-video bg-gray-900">
          <img
            src={currentImage}
            alt={`${altPrefix} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              {selectedIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails Strip */}
        {galleryImages.length > 1 && (
          <div className="p-4 bg-white">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedIndex(index)}
                  className={`
                    flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200
                    ${
                      selectedIndex === index
                        ? "ring-2 ring-[#05073c] ring-offset-2 scale-105"
                        : "ring-1 ring-gray-200 hover:ring-gray-300 opacity-70 hover:opacity-100"
                    }
                    focus:outline-none focus:ring-2 focus:ring-[#05073c] focus:ring-offset-2
                  `}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={selectedIndex === index}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24">
                    <img
                      src={image}
                      alt={`${altPrefix} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedIndex === index && (
                    <div className="absolute inset-0 bg-[#05073c]/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}