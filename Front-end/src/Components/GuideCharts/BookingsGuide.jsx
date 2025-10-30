import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TrendingUp, Calendar, CalendarDays, CalendarRange } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { fetchMonthlyStats } from "../../store/slices/bookingSlice"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

export function BookingGuide() {
  const dispatch = useDispatch();
  const { monthlyStats, loading } = useSelector((state) => state.booking);
  const currentYear = new Date().getFullYear();

  // États pour les filtres
  const [filterType, setFilterType] = useState('year'); // 'year', 'month', 'week'
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Générer les années disponibles (5 dernières années)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  // Noms des mois
  const monthNames = [
    { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
    { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
    { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
  ];

  // Générer les semaines (1-52)
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

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
    <div className="space-y-6">
      {/* Filtres professionnels */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-6">
          {/* Header avec titre */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Filter Analytics</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              Live Data
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type de filtre - Onglets simples et élégants */}
            <div className="lg:col-span-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">
                Time Period
              </label>
              <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full">
                <button
                  onClick={() => setFilterType('year')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer ${
                    filterType === 'year'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Year</span>
                </button>
                <button
                  onClick={() => setFilterType('month')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer ${
                    filterType === 'month'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Month</span>
                </button>
                <button
                  onClick={() => setFilterType('week')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer ${
                    filterType === 'week'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CalendarRange className="w-4 h-4" />
                  <span>Week</span>
                </button>
              </div>
            </div>

            {/* Sélecteur d'année */}
            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">
                Year
              </label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-full h-11 px-4 rounded-lg border-0 focus:ring-2 focus:ring-orange-100 transition-all bg-gradient-to-r from-white to-gray-50 text-gray-800 font-semibold cursor-pointer shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <SelectValue placeholder="Select year" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-xl">
                  {years.map(year => (
                    <SelectItem 
                      key={year} 
                      value={year.toString()}
                      className="cursor-pointer hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black text-gray-700 font-medium py-2.5"
                    >
                      <span className="flex items-center gap-2">
                        {year}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sélecteur de mois ou semaine (conditionnel) */}
            {filterType === 'month' && (
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">
                  Select Month
                </label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-full h-11 px-4 rounded-lg border-0 focus:ring-2 focus:ring-orange-100 transition-all bg-gradient-to-r from-white to-gray-50 text-gray-800 font-semibold cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-orange-500" />
                      <SelectValue placeholder="Select month" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg shadow-xl max-h-[350px]">
                    {monthNames.map(month => (
                      <SelectItem 
                        key={month.value} 
                        value={month.value.toString()}
                        className="cursor-pointer hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black text-gray-700 font-medium py-2.5"
                      >
                        <span className="flex items-center gap-2">
                          {month.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === 'week' && (
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">
                  Select Week
                </label>
                <Select value={selectedWeek.toString()} onValueChange={(value) => setSelectedWeek(parseInt(value))}>
                  <SelectTrigger className="w-full h-11 px-4 rounded-lg border-0 focus:ring-2 focus:ring-orange-100 transition-all bg-gradient-to-r from-white to-gray-50 text-gray-800 font-semibold cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <CalendarRange className="w-4 h-4 text-orange-500" />
                      <SelectValue placeholder="Select week" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg shadow-xl max-h-[300px]">
                    {weeks.map(week => (
                      <SelectItem 
                        key={week} 
                        value={week.toString()}
                        className="cursor-pointer hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black text-gray-700 font-medium py-2.5"
                      >
                        <span className="flex items-center gap-2">
                          Week {week}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card du chart */}
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
    </div>
  )
}
