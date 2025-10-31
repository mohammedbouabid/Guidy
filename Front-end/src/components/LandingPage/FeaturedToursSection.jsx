import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
  ChevronRightIcon,
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

export const FeaturedPacksSection = () => {
  const navigate = useNavigate()
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

  const handlePackClick = (packId) => {
    navigate(`/packs/${packId}`)
  }

  const handleSeeAllClick = () => {
    navigate("/packs")
  }

  if (loading) return <p className="text-center py-10">Loading tours...</p>
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#05073c] leading-tight">
            Find Popular Tours
          </h2>
          <Button
            variant="ghost"
            onClick={handleSeeAllClick}
            className="text-sm sm:text-base text-[#05073c] hover:text-orange-500 hover:bg-transparent px-0 h-auto font-normal cursor-pointer group"
          >
            See all
            <ChevronRightIcon className="ml-1 w-4 h-4 text-[#05073c] group-hover:text-orange-500" />
          </Button>
        </div>


        {/* Carousel Wrapper */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {packs.map((pack) => (
                <CarouselItem
                  key={pack._id}
                  className="pl-4 basis-[90%] sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
                >
                  <Card
                    className="rounded-xl border border-[#e7e6e6] overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    onClick={() => handlePackClick(pack._id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <div
                          className="w-full h-[180px] sm:h-[200px] bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${pack.profileImg})` }}
                        />
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPinIcon className="w-4 h-4 text-[#717171]" />
                          <span className="text-xs text-[#717171]">
                            {pack.startLocation || "Unknown"}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-semibold text-[#05073c] leading-snug mb-2 truncate">
                          {pack.title}
                        </h3>

                        <p className="text-sm font-medium text-[#05073c] truncate mb-2">
                          {pack.description}
                        </p>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, index) => (
                              <StarIcon
                                key={index}
                                className={`w-3 h-3 ${typeof pack.avgRating === "number" &&
                                    index < Math.round(pack.avgRating)
                                    ? "fill-[#e2ad64] text-[#e2ad64]"
                                    : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#05073c]">
                            {typeof pack.avgRating === "number"
                              ? pack.avgRating.toFixed(1)
                              : "No ratings"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#e7e6e6]">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-[#05073c]" />
                            <span className="text-xs text-[#05073c]">
                              {pack.duration || "N/A"}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-[#05073c]">From</span>
                            <span className="text-sm font-medium text-[#05073c]">
                              ${pack.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Bottom-centered arrows — force STATIC to override absolute left/right */}
            <div className="mt-6 flex justify-center gap-4 py-5 ">
              <CarouselPrevious className="static w-9 h-9 border border-gray-300 rounded-full hover:bg-gray-100 cursor-pointer" />
              <CarouselNext className="static w-9 h-9 border border-gray-300 rounded-full hover:bg-gray-100 cursor-pointer" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
