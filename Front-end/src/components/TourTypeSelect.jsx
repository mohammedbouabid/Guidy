import * as React from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select"

const TOUR_OPTIONS = [
  { value: "Hiking & Trekking", group: "Adventure", label: "Hiking & Trekking" },
  { value: "Safari & Wildlife", group: "Adventure", label: "Safari & Wildlife" },
  { value: "Water Sports", group: "Adventure", label: "Water Sports" },
  { value: "Extreme Sports", group: "Adventure", label: "Extreme Sports" },
  { value: "Beach Holidays", group: "Relaxation", label: "Beach Holidays" },
  { value: "Spa & Wellness", group: "Relaxation", label: "Spa & Wellness" },
  { value: "Cruises", group: "Relaxation", label: "Cruises" },
  { value: "Historical Tours", group: "Cultural", label: "Historical Tours" },
  { value: "Art & Museums", group: "Cultural", label: "Art & Museums" },
  { value: "Food & Culinary", group: "Cultural", label: "Food & Culinary" },
  { value: "Festivals & Events", group: "Cultural", label: "Festivals & Events" },
  { value: "Eco Tours", group: "Nature", label: "Eco Tours" },
  { value: "Mountains & Landscapes", group: "Nature", label: "Mountains & Landscapes" },
  { value: "National Parks", group: "Nature", label: "National Parks" },
  { value: "City Breaks", group: "Urban", label: "City Breaks" },
  { value: "Nightlife & Entertainment", group: "Urban", label: "Nightlife & Entertainment" },
  { value: "Shopping Tours", group: "Urban", label: "Shopping Tours" },
];

export function TourTypeSelect({ value, onChange, placeholder = "Select tour type" }) {
  const grouped = React.useMemo(() => {
    return TOUR_OPTIONS.reduce((acc, option) => {
      acc[option.group] = acc[option.group] ? [...acc[option.group], option] : [option];
      return acc;
    }, {});
  }, []);

  return (
    <Select value={value ?? undefined} onValueChange={onChange}>
      <SelectTrigger
        className="
          w-[220px]
          border border-gray-300
          rounded-md px-3 py-2
          text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-[#eb662b]
          data-[placeholder]:text-gray-400
        "
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {Object.entries(grouped).map(([groupLabel, options]) => (
          <SelectGroup key={groupLabel}>
            <SelectLabel>{groupLabel}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
