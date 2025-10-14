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

export function TourTypeSelect() {
  return (
    <Select>
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
        <SelectValue placeholder="Select tour type" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Adventure</SelectLabel>
          <SelectItem value="hiking">Hiking & Trekking</SelectItem>
          <SelectItem value="safari">Safari & Wildlife</SelectItem>
          <SelectItem value="water">Water Sports</SelectItem>
          <SelectItem value="extreme">Extreme Sports</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Relaxation</SelectLabel>
          <SelectItem value="beach">Beach Holidays</SelectItem>
          <SelectItem value="spa">Spa & Wellness</SelectItem>
          <SelectItem value="cruise">Cruises</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Cultural</SelectLabel>
          <SelectItem value="history">Historical Tours</SelectItem>
          <SelectItem value="art">Art & Museums</SelectItem>
          <SelectItem value="food">Food & Culinary</SelectItem>
          <SelectItem value="festival">Festivals & Events</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Nature</SelectLabel>
          <SelectItem value="eco">Eco Tours</SelectItem>
          <SelectItem value="mountain">Mountains & Landscapes</SelectItem>
          <SelectItem value="parks">National Parks</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Urban</SelectLabel>
          <SelectItem value="city">City Breaks</SelectItem>
          <SelectItem value="nightlife">Nightlife & Entertainment</SelectItem>
          <SelectItem value="shopping">Shopping Tours</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
