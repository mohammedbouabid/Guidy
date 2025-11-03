import { useState } from "react";
import { BookingGuide } from "@/Components/GuideCharts/BookingsGuide";
import { ChartPieSimple } from "@/Components/GuideCharts/ChartPieSimple";
import { PacksCharts } from "@/Components/GuideCharts/PacksCharts";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Analtytics() {
  const currentYear = new Date().getFullYear();
  
  // États centralisés pour les filtres
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

  return (
    <div className="flex flex-col gap-5 justify-between max-w-full overflow-hidden">
      {/* Filtres centralisés pour tous les charts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Filter Analytics</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              Live Data
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type de filtre */}
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
                      <span className="flex items-center gap-2">{year}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sélecteur de mois */}
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
                        <span className="flex items-center gap-2">{month.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sélecteur de semaine */}
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
                        <span className="flex items-center gap-2">Week {week}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts avec filtres partagés */}
      <div className="w-full">
        <BookingGuide 
          filterType={filterType}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedWeek={selectedWeek}
        />
      </div>
      <div className="w-full flex gap-4 min-w-0">
        <div className="flex-[6] min-w-0">
          <PacksCharts 
            filterType={filterType}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedWeek={selectedWeek}
          />
        </div>
        <div className="flex-[4] min-w-0">
          <ChartPieSimple 
            filterType={filterType}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedWeek={selectedWeek}
          />
        </div>
      </div>
    </div>
  );
}

export default Analtytics;
