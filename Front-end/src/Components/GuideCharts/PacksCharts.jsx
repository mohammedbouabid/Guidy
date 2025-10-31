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
} from "@/components/ui/card";
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

export function PacksCharts() {
  const dispatch = useDispatch();
  const { monthlyStats, statsLoading } = useSelector((state) => state.pack);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    dispatch(fetchMonthlyPackStats({ year: currentYear }));
  }, [dispatch, currentYear]);

  console.log(" PacksCharts - monthlyStats:", monthlyStats);
  console.log(" PacksCharts - statsLoading:", statsLoading);

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Packs Activity {currentYear}</CardTitle>
        <CardDescription>
          Total packs created: {totalPacks} | Year {currentYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          {statsLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading data...</p>
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
          Showing total packs created for {currentYear}
        </div>
      </CardFooter>
    </Card>
  );
}
