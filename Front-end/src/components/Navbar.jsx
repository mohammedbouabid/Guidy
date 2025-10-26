import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-white ">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-25 py-0.5">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <span
              className="text-[22px] font-bold tracking-tight cursor-pointer"
              style={{ color: "#eb662b" }}
            >
              Guidy
            </span>
          </div>

          {/* Middle: Search Bar */}
          <div className="flex-1 mx-6 max-w-xl">
            <input
              type="text"
              placeholder="Search destinations or activities"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            />
          </div>

          {/* Right: Links */}
          <div className="flex items-center space-x-5">
            <a href="#" className="text-sm text-gray-700 hover:text-[#eb662b]">
              Destinations
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-[#eb662b]">
              Activities
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-[#eb662b]">
              USD
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-[#eb662b]">
              Sign up
            </a>
            <button
              className="text-white text-sm px-5 py-2 rounded-3xl transition-colors hover:cursor-pointer"
              style={{ backgroundColor: "#eb662b" }}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
