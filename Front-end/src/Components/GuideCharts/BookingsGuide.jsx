import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { fetchMonthlyStats } from "../../store/slices/bookingSlice"

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

export const description = "Monthly Reservations Chart"

const chartConfig = {
  desktop: {
    label: "Reservations",
    color: "var(--chart-1)",
  },
}

// Noms des mois pour affichage
const monthNames = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
];

export function BookingGuide({ filterType, selectedYear, selectedMonth, selectedWeek }) {
  const dispatch = useDispatch();
  const { monthlyStats, loading } = useSelector((state) => state.booking);

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
    
    dispatch(fetchMonthlyStats(params));
  }, [dispatch, selectedYear, filterType, selectedMonth, selectedWeek]);

  // Calculer le total des réservations
  const totalReservations = monthlyStats.reduce((sum, item) => sum + item.desktop, 0);
  
  // Calculer la tendance (comparer les 6 derniers mois avec les 6 premiers)
  const firstHalf = monthlyStats.slice(0, 6).reduce((sum, item) => sum + item.desktop, 0);
  const secondHalf = monthlyStats.slice(6, 12).reduce((sum, item) => sum + item.desktop, 0);
  const trend = firstHalf > 0 ? (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1) : 0;

  return (
    <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            {filterType === 'year' && `Reservations Analytics ${selectedYear}`}
            {filterType === 'month' && `${monthNames.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
            {filterType === 'week' && `Week ${selectedWeek} - ${selectedYear}`}
          </CardTitle>
          <CardDescription>
            Total reservations: {totalReservations}
            {filterType === 'year' && ` | Full Year ${selectedYear}`}
            {filterType === 'month' && ` | ${monthNames.find(m => m.value === selectedMonth)?.label}`}
            {filterType === 'week' && ` | Week ${selectedWeek}`}
          </CardDescription>
        </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[250px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : (
          <AreaChart
            accessibilityLayer
            data={monthlyStats}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#fe8356ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FFF4E6" stopOpacity={0.8}/>
                {/* <stop offset="95%" stopColor="#" stopOpacity={0.3}/> */}
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Si c'est un nombre, le retourner tel quel
                if (!isNaN(value)) return value;
                // Si c'est un texte (mois ou jour), tronquer à 3 caractères
                return value.slice(0, 3);
              }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#colorDesktop)"
              fillOpacity={1}
              stroke="#FF6B35"
              strokeWidth={2}
            />
          </AreaChart>
          )}
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trend >= 0 ? (
                <>
                  Trending up by {Math.abs(trend)}% <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Trending down by {Math.abs(trend)}%
                </>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {filterType === 'year' && `January - December ${selectedYear}`}
              {filterType === 'month' && `${monthNames.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
              {filterType === 'week' && `Week ${selectedWeek}, ${selectedYear}`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
