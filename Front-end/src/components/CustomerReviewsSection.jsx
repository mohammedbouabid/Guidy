import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  {
    name: "John Smith",
    role: "Traveler",
    rating: 4.7,
    text: "I had an amazing experience with this company. The service was top-notch, and the staff was incredibly friendly. I highly recommend them!",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  },
  {
    name: "Fatima Zahra",
    role: "Explorer",
    rating: 4.9,
    text: "Guidy made my trip unforgettable. Everything was smooth and well organized. Will definitely book again!",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    name: "Alex Johnson",
    role: "Solo Traveler",
    rating: 4.6,
    text: "Loved the experience! The guides were knowledgeable and the destinations were breathtaking.",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    name: "Sara Ali",
    role: "Backpacker",
    rating: 4.8,
    text: "The booking process was easy and the support team was super responsive. Great platform!",
    image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
  },
  {
    name: "Mohammed El Amrani",
    role: "Photographer",
    rating: 4.7,
    text: "I discovered hidden gems I wouldn’t have found on my own. Highly recommend Guidy!",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  },
];

const CustomerReviewsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const review = reviews[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full py-12 px-4 bg-[#f9f9f9] flex flex-col items-center gap-12">
      <h2 className="text-[30px] font-bold text-[#05073c] text-center">
        Customer Reviews
      </h2>

      <div className="max-w-xl w-full relative">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center gap-6 p-0">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow mb-6">
              <img
                src={review.image}
                alt={review.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Review Content */}
            <div className="text-center space-y-4">
              <h3 className="text-[#eb662b] text-lg font-medium">
                Excellent Service!
              </h3>
              <p className="text-[#05073c] text-[18px] font-medium leading-relaxed">
                {review.text}
              </p>
              <div>
                <p className="text-[#05073c] text-[15px] font-semibold">
                  {review.name}
                </p>
                <p className="text-[#05073c] text-sm">{review.role}</p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-white shadow hover:bg-gray-100 transition"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-white shadow hover:bg-gray-100 transition"
              >
                ›
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-4 bg-[#05073c]" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
