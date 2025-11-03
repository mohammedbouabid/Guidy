import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "../ui/DateRangePicker";
import { TourTypeSelect } from "../TourTypeSelect";

export default function SearchBar() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState(undefined);
  const [tourType, setTourType] = useState(undefined);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (destination.trim()) params.set("startLocation", destination.trim());
    if (dateRange?.from) params.set("startDateFrom", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to) params.set("startDateTo", format(dateRange.to, "yyyy-MM-dd"));
    if (tourType) params.set("category", tourType);

    navigate(`/filter?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-20 w-full max-w-3xl px-6">
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Search destinations"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
        />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <TourTypeSelect value={tourType} onChange={setTourType} />
        <button
          type="submit"
          className="bg-[#eb662b] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#d9551f] transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
