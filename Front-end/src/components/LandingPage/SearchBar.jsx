import React from "react";
import { DateRangePicker } from "../ui/DateRangePicker";
import { TourTypeSelect } from "../TourTypeSelect";

export default function SearchBar() {
  return (
    <div className="relative z-20 w-full max-w-3xl px-6">
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Search destinations"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
        />
        <DateRangePicker />
        <TourTypeSelect />
        <button className="bg-[#eb662b] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#d9551f] transition-colors">
          Search
        </button>
      </div>
    </div>
  );
}
