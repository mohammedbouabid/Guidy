import { BookingGuide } from "@/Components/GuideCharts/BookingsGuide";
import { PacksCharts } from "@/Components/GuideCharts/PacksCharts";

function Analtytics() {
  return (
    <div className="flex flex-col gap-5 justify-between">
      <div>
        <BookingGuide />
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <PacksCharts />
        </div>
        <div className="col-span-1">
          {/* TODO: Ajouter un autre chart ici (ex: RevenueChart, ClientsChart, etc.) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full flex items-center justify-center">
            <p className="text-gray-400">Deuxième chart à venir</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analtytics;
