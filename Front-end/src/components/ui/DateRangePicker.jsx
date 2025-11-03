"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/components/ui/button"
import { Calendar } from "@/components/ui/calendar" // your custom Calendar
import { cn } from "@/lib/utils"

export function DateRangePicker() {
  const [range, setRange] = React.useState(undefined)

  return (
    <Popover>
      {/* Trigger button (looks like an input) */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-start text-left font-normal border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800",
            !range && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, "LLL dd")} ~ {format(range.to, "LLL dd")}
              </>
            ) : (
              format(range.from, "LLL dd, y")
            )
          ) : (
            <span>Select a date range</span>
          )}
        </Button>
      </PopoverTrigger>

      {/* Calendar only shows when trigger is clicked */}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={setRange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
