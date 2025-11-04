import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SortDropdown({ sort, handleSortChange }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "", label: "Default" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
    { value: "-avgRating", label: "Rating: High to Low" },
    { value: "avgRating", label: "Rating: Low to High" },
    { value: "-startDate", label: "Most Recent Start Date" },
    { value: "startDate", label: "Start Date Soonest" },
  ];

  return (
    <div className="relative w-40">
      <label className="text-xs font-medium text-gray-600">Sort by</label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-full border border-[#eb662b] rounded-md px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fff8f4] to-white text-[#05073c] shadow-sm hover:bg-[#fff2ea] focus:outline-none focus:ring-2 focus:ring-[#eb662b] transition-all"
      >
        <span>{options.find((o) => o.value === sort)?.label || "Default"}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#eb662b] transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open && (
        <ul className="absolute mt-1 w-full bg-white border border-[#eb662b]/30 rounded-md shadow-md overflow-hidden z-10">
          {options.map((o) => (
            <li
              key={o.value}
              onClick={() => {
                handleSortChange(o.value);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer transition-all ${
                o.value === sort
                  ? "bg-[#eb662b] text-white"
                  : "text-[#05073c] hover:bg-[#fff4ee] hover:text-[#eb662b]"
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
