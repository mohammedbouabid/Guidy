import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative w-full h-[75vh] bg-cover bg-center flex items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your world of joy
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Find and book experiences for fun‑loving adventurers, discover the
            memories you’ll keep reliving, anywhere.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-center gap-3 max-w-4xl">
            <input
              type="text"
              placeholder="Search destinations"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            />
            <input
              type="text"
              placeholder="Select a date"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            />
            <select className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#eb662b]">
              <option>All tour types</option>
              <option>Adventure</option>
              <option>Relaxation</option>
              <option>Cultural</option>
            </select>
            <button className="bg-[#eb662b] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#d9551f] transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
