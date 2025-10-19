import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button"; // adjust import to your Button component

const FeaturedGuides = () => {
  // Temporary static data with mock trips
  const guides = [
    {
      id: 1,
      name: "John Doe",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      trips: 24,
    },
    {
      id: 2,
      name: "Fatima Zahra",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      trips: 18,
    },
    {
      id: 3,
      name: "Alex Johnson",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      trips: 32,
    },
    {
      id: 4,
      name: "Sara Ali",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
      trips: 15,
    },
    {
      id: 5,
      name: "Mohammed El Amrani",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
      trips: 27,
    },
    {
      id: 6,
      name: "Emily Smith",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      trips: 21,
    },
  ];

  return (
    <section className="w-full py-8 px-25">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="[font-family:'Inter',Helvetica] font-bold text-[#05073c] text-[29.9px] leading-[45px]">
            Featured Guides
          </h2>
          <Button
            variant="ghost"
            className="h-auto p-0 hover:bg-transparent group"
          >
            <span className="[font-family:'Inter',Helvetica] font-normal text-[#05073c] text-[14.3px] leading-[28.1px] mr-1">
              See all
            </span>
            <ChevronRightIcon className="w-4 h-4 text-[#05073c]" />
          </Button>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-md mb-3 cursor-pointer">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold text-[#05073c]">
                {guide.name}
              </h3>
              <p className="text-xs text-gray-500">{guide.trips} trips</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuides;
