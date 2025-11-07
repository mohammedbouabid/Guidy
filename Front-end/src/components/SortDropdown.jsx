import { useState } from "react";
import { ChevronDown, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";

const SORT_FIELDS = [
  { value: "", label: "Default" },
  { value: "price", label: "Price" },
  { value: "avgRating", label: "Rating" },
  { value: "startDate", label: "Start Date" },
];

const toSortValue = (field, desc) => {
  if (!field) return "";
  return desc ? `-${field}` : field;
};

export default function SortDropdown({ sort = "", handleSortChange }) {
  const [open, setOpen] = useState(false);

  const isDesc = sort.startsWith("-");
  const currentField = sort.replace(/^-/, "");
  const activeOption = SORT_FIELDS.find((opt) => opt.value === currentField) || SORT_FIELDS[0];

  const applySort = (field, desc = isDesc) => {
    handleSortChange(toSortValue(field, desc));
  };

  const toggleDirection = () => {
    if (!currentField) return;
    applySort(currentField, !isDesc);
  };

  const handleSelect = (field) => {
    setOpen(false);
    applySort(field);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">Sort</label>
      <div className="flex items-center gap-2">
        <div className="relative min-w-[9rem] cursor-pointer">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex justify-between items-center w-full border border-[#eb662b] rounded-md px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fff8f4] to-white text-[#05073c] shadow-sm hover:bg-[#fff2ea] focus:outline-none focus:ring-2 focus:ring-[#eb662b] transition-all cursor-pointer"
          >
            <span>{activeOption.label}</span>
            <ChevronDown
              className={`h-4 w-4 text-[#eb662b] transition-transform ${open ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {open && (
            <ul className="absolute mt-1 w-full bg-white border border-[#eb662b]/40 rounded-md shadow-md overflow-hidden z-20">
              {SORT_FIELDS.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-all ${
                    opt.value === currentField
                      ? "bg-[#eb662b] text-white"
                      : "text-[#05073c] hover:bg-[#fff4ee] hover:text-[#eb662b]"
                  }`}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={toggleDirection}
          disabled={!currentField}
          className={`border border-[#eb662b] rounded-md p-2 text-[#eb662b] bg-white shadow-sm transition-all ${
            currentField
              ? "hover:bg-[#fff2ea] focus:outline-none focus:ring-2 focus:ring-[#eb662b] cursor-pointer"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          {isDesc ? (
            <ArrowDownWideNarrow className="h-4 w-4" />
          ) : (
            <ArrowUpWideNarrow className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
