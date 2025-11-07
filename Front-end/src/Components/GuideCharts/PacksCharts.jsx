import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { fetchMonthlyPackStats } from "../../store/slices/packSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A vertical bar chart showing monthly pack creation statistics";

// ✅ Configuration du chart
const chartConfig = {
  packs: {
    label: "Packs",
    color: "#EB662B",
  },
};

// Noms des mois pour affichage
const monthNames = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
];

export function PacksCharts({ selectedYear = new Date().getFullYear(), filterType = 'year', selectedMonth, selectedWeek }) {
  const dispatch = useDispatch();
  const { monthlyStats, statsLoading } = useSelector((state) => state.pack);

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
    
    console.log("🔄 PacksCharts - Fetching data with params:", params);
    dispatch(fetchMonthlyPackStats(params));
  }, [dispatch, selectedYear, filterType, selectedMonth, selectedWeek]);

  console.log("📊 PacksCharts - monthlyStats:", monthlyStats);
  console.log("📊 PacksCharts - statsLoading:", statsLoading);

  // Calculer le total des packs créés
  const totalPacks = Array.isArray(monthlyStats) 
    ? monthlyStats.reduce((sum, item) => sum + (item.packs || 0), 0)
    : 0;

  // Calculer la tendance (comparer le dernier mois avec la moyenne)
  const lastMonthPacks = Array.isArray(monthlyStats) && monthlyStats.length > 0 
    ? monthlyStats[monthlyStats.length - 1]?.packs || 0 
    : 0;
  const avgPacks = totalPacks / (Array.isArray(monthlyStats) && monthlyStats.length > 0 ? monthlyStats.length : 1);
  const trend = avgPacks > 0 ? (((lastMonthPacks - avgPacks) / avgPacks) * 100).toFixed(1) : 0;

  return (
    <Card className="w-full max-w-full min-w-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Packs Activity {selectedYear}
          {filterType === 'month' && ` - ${monthNames.find(m => m.value === selectedMonth)?.label}`}
          {filterType === 'week' && ` - Week ${selectedWeek}`}
        </CardTitle>
        <CardDescription>
          Total packs created: {totalPacks}
          {filterType === 'year' && ` | Year ${selectedYear}`}
          {filterType === 'month' && ` | ${monthNames.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
          {filterType === 'week' && ` | Week ${selectedWeek}, ${selectedYear}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <ChartContainer config={chartConfig} className="w-full h-[250px] max-w-full">
          {statsLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : !Array.isArray(monthlyStats) || monthlyStats.length === 0 || totalPacks === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-muted-foreground font-medium">No data available</p>
              <p className="text-xs text-gray-400">
                {filterType === 'year' && `No packs found for ${selectedYear}`}
                {filterType === 'month' && `No packs found for ${monthNames.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
                {filterType === 'week' && `No packs found for Week ${selectedWeek}, ${selectedYear}`}
              </p>
            </div>
          ) : (
          <BarChart
            accessibilityLayer
            data={Array.isArray(monthlyStats) ? monthlyStats : []}
            margin={{
              top: 20,
              right: 12,
              left: 12,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              vertical={false} 
              stroke="#f0f0f0"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3).toUpperCase()}
              className="text-xs text-gray-500"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-gray-500"
            />

            <ChartTooltip
              cursor={{ fill: 'rgba(235, 102, 43, 0.1)' }}
              content={<ChartTooltipContent />}
            />

            <Bar
              dataKey="packs"
              fill="#EB662B"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
          )}
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-gray-700">
          {trend >= 0 ? (
            <>
              Trending up by {Math.abs(trend)}% <TrendingUp className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(trend)}%
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          {filterType === 'year' && `Showing total packs created for ${selectedYear}`}
          {filterType === 'month' && `Showing packs for ${monthNames.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
          {filterType === 'week' && `Showing packs for Week ${selectedWeek}, ${selectedYear}`}
        </div>
      </CardFooter>
    </Card>
  );
}
