import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell, Legend } from "recharts"

// Noms des mois pour affichage
const monthNames = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
]

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { fetchStatusStats } from "../../store/slices/bookingSlice"

export const description = "Booking status distribution pie chart"

// Palette de couleurs orange pour les statuts (nuances d'orange de l'application)
const STATUS_COLORS = {
  "Completed": "#FFB088",      // Orange clair
  "Cancelled": "#FFD4BB",      // Orange très clair
  "In Progress": "#EB662B"     // Orange principal
}

export function ChartPieSimple({ filterType, selectedYear, selectedMonth, selectedWeek }) {
  const dispatch = useDispatch()
  const { statusStats, statusLoading } = useSelector((state) => state.booking)

  useEffect(() => {
    const params = {
      year: selectedYear,
      filterType: filterType
    };
    
    if (filterType === 'month') {
      params.month = selectedMonth;
    } else if (filterType === 'week') {
      params.week = selectedWeek;
    }
    
    dispatch(fetchStatusStats(params));
  }, [dispatch, selectedYear, filterType, selectedMonth, selectedWeek])

  console.log("📊 ChartPieSimple - statusStats:", statusStats)
  console.log("📊 ChartPieSimple - statusLoading:", statusLoading)

  // Transform data for the chart
  const chartData = Array.isArray(statusStats)
    ? statusStats.map((item) => ({
        status: item.status,
        bookings: item.count,
        fill: STATUS_COLORS[item.status] || "#9CA3AF",
      }))
    : []

  // Calculate total bookings
  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0)

  // Get percentages
  const getPercentage = (count) => {
    return totalBookings > 0 ? ((count / totalBookings) * 100).toFixed(1) : 0
  }

  // Dynamic config based on status
  const chartConfig = chartData.reduce((config, item) => {
    config[item.status] = {
      label: item.status,
      color: item.fill,
    }
    return config
  }, {
    bookings: {
      label: "Bookings",
    },
  })

  return (
    <Card className="w-full max-w-full min-w-0 py-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Booking Status Distribution</CardTitle>
        <CardDescription>Total bookings: {totalBookings}</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <ChartContainer
          config={chartConfig}
          className="w-full h-[250px] max-w-full"
        >
          {statusLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <p className="text-muted-foreground font-medium">No data available</p>
              <p className="text-xs text-gray-400">
                {filterType === 'year' && `No booking status data for ${selectedYear}`}
                {filterType === 'month' && `No booking status data for ${monthNames.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
                {filterType === 'week' && `No booking status data for Week ${selectedWeek}, ${selectedYear}`}
              </p>
            </div>
          ) : (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="bookings"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={(entry) => `${getPercentage(entry.bookings)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-gray-700">
          {chartData.length > 0 && (
            <>
              Most bookings: {chartData[0]?.status} ({chartData[0]?.bookings})
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing booking distribution by status
        </div>
      </CardFooter>
    </Card>
  )
}
