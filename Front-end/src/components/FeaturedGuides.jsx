import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

const FeaturedGuides = () => {
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
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#05073c] leading-tight mb-6">
          Featured Guides
        </h2>

        {/* Guides Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md mb-3 hover:scale-105 transition-transform duration-300">
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

        {/* Bottom “See All” Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="h-auto px-0 py-0 text-sm sm:text-base text-[#05073c] hover:text-orange-500 hover:bg-transparent group"
          >
            <span className="mr-1">See all</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>

  );
};

export default FeaturedGuides;
