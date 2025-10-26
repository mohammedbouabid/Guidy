import React, { useEffect, useState } from "react"
import {
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react"
import { Button } from "./ui/button"// adjust path
import { Card, CardContent } from "./ui/card" // adjust path

export const FeaturedPacksSection = () => {
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopularPacks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/packs/popular")
        if (!res.ok) throw new Error("Failed to fetch popular packs")
        const data = await res.json()
        setPacks(Array.isArray(data.docs) ? data.docs : [])
      } catch (err) {
        console.error("Error fetching popular packs:", err)
        setError("Could not load popular packs")
      } finally {
        setLoading(false)
      }
    }
    fetchPopularPacks()
  }, [])

  if (loading) return <p className="text-center py-10">Loading tours...</p>
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>

  return (
    <section className="w-full py-12 px-25">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-bold text-[#05073c] text-2xl sm:text-[29.4px] leading-tight">
            Find Popular Tours
          </h2>
          <Button
            variant="ghost"
            className="h-auto p-0 font-normal text-[#05073c] text-sm sm:text-[14.3px] hover:bg-transparent flex items-center"
          >
            See all
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {packs.map((pack) => (
            <Card
              key={pack._id}
              className="rounded-xl border border-solid border-[#e7e6e6] overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div
                    className="w-full h-[199px] rounded-t-xl bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${pack.profileImg})` }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-[11px] right-[11px] w-[35px] h-[35px] bg-white rounded-full shadow-[0px_10px_40px_#0000000d] hover:bg-white"
                  >
                    <HeartIcon className="w-[15px] h-[15px] text-black" />
                  </Button>
                </div>

                <div className="p-[21px]">
                  <div className="flex items-center gap-[5px] mb-[10px]">
                    <MapPinIcon className="w-4 h-4 text-[#717171]" />
                    <span className="text-[#717171] text-xs sm:text-[12.3px]">
                      {pack.startLocation || "Unknown"}
                    </span>
                  </div>

                  <h3 className="font-medium text-[#05073c] text-sm sm:text-[15.8px] leading-6 mb-[14px] min-h-[48px]">
                    {pack.title}
                  </h3>

                  <div className="flex items-center gap-[10px] mb-[16px]">
                    <div className="flex gap-[5px]">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`w-[10px] h-[10px] ${
                            index < Math.round(pack.avgRating)
                              ? "fill-[#e2ad64] text-[#e2ad64]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[#05073c] text-xs sm:text-[12.5px]">
                      {pack.avgRating} ({pack.reviewsCount || 0})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-[15px] border-t border-solid border-[#e7e6e6]">
                    <div className="flex items-center gap-[4.8px]">
                      <ClockIcon className="w-4 h-4 text-[#05073c]" />
                      <span className="text-[#05073c] text-xs sm:text-[12.6px]">
                        {pack.duration || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-[#05073c] text-xs sm:text-[13px]">
                        From
                      </span>
                      <span className="font-medium text-[#05073c] text-sm sm:text-[14.5px]">
                        ${pack.price}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
