import React from "react";
import SearchBar from "./SearchBar"; // adjust path if needed

const HeroSection = () => {
  return (
    <section
      className="relative mb-16 mx-6 h-[75vh] bg-cover bg-bottom flex flex-col items-center justify-center rounded-t-2xl"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/c13fHBB7/image-9.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-3xl px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your world of joy
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Find and book experiences for fun‑loving adventurers, discover the
          memories you’ll keep reliving, anywhere.
        </p>
      </div>

      {/* SearchBar (simple drop-in) */}
      <SearchBar />

      {/* Shape Divider at Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12 transform rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V27.35c47.79,22,103.59,29,158,17.39C230,31,284,0,339,0c54,0,108,31,162,43s107,12,161,0,108-31,162-31,108,12,162,24,108,24,162,12,108-36,162-48V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
