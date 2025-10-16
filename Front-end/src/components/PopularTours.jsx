import React, { useEffect, useState } from "react"

export default function PopularTours() {
  const [tours, setTours] = useState([])       // always an array
  const [loading, setLoading] = useState(true) // loading state
  const [error, setError] = useState(null)     // error state

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/packs/public") // adjust if your backend route differs
        if (!res.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await res.json()
        console.log("API response:", data) // 👀 check what backend returns

        // mongoose-paginate returns { docs: [...], totalDocs, ... }
        setTours(Array.isArray(data.docs) ? data.docs : [])
      } catch (err) {
        console.error("Error fetching tours:", err)
        setError("Failed to load tours")
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  if (loading) {
    return <p className="text-center py-10">Loading tours...</p>
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Find Popular Tours
        </h2>

        {/* Grid of tours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tours.map((tour) => (
            <div key={tour._id} className="flex flex-col">
              {/* Image */}
              <div className="relative w-full h-56 rounded-lg overflow-hidden">
                <img
                  src={tour.profileImg}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="mt-4 flex flex-col flex-1">
                <p className="text-sm text-gray-500">
                  {tour.startLocation}, {tour.endLocation}
                </p>
                <h3 className="text-base font-semibold text-gray-900 mt-1 line-clamp-2">
                  {tour.title}
                </h3>
                <p className="text-sm font-medium text-[#eb662b] mt-2">
                  From ${tour.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* See All button */}
        <div className="text-center mt-10">
          <a
            href="/packs"
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-[#eb662b] rounded-md hover:bg-[#d9551f] transition"
          >
            See All
          </a>
        </div>
      </div>
    </section>
  )
}
