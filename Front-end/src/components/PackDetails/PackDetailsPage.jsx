import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/components/ui/button";
import { Card, CardContent } from "@/components/ui/components/ui/card";
import { fetchPackById } from "@/store/slices/packSlice"; // Adjust path as needed

const PackDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pack, setPack] = useState(null);

  useEffect(() => {
    const loadPackDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch pack details from API
        const response = await fetch(`http://localhost:3000/api/packs/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch pack details");
        }
        
        const data = await response.json();
        setPack(data);
      } catch (err) {
        console.error("Error fetching pack:", err);
        setError(err.message || "Could not load pack details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPackDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05073c] mx-auto mb-4"></div>
          <p className="text-[#05073c]">Loading pack details...</p>
        </div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{error || "Pack not found"}</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden">
              <div
                className="w-full h-[400px] bg-cover bg-center"
                style={{
                  backgroundImage: `url(${pack.profileImg || "/placeholder-tour.jpg"})`,
                }}
              />
            </Card>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-[#05073c] mb-3">
                {pack.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`w-5 h-5 ${
                          typeof pack.avgRating === "number" &&
                          index < Math.round(pack.avgRating)
                            ? "fill-[#e2ad64] text-[#e2ad64]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[#05073c]">
                    {typeof pack.avgRating === "number"
                      ? pack.avgRating.toFixed(1)
                      : "No ratings yet"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#717171]">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">
                    {pack.startLocation} → {pack.endLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#05073c] mb-4">
                  About This Tour
                </h2>
                <p className="text-[#717171] leading-relaxed whitespace-pre-line">
                  {pack.description || "No description available."}
                </p>
              </CardContent>
            </Card>

            {/* Tour Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#05073c] mb-4">
                  Tour Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#05073c]">Start Date</p>
                      <p className="text-sm text-[#717171]">{formatDate(pack.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#05073c]">End Date</p>
                      <p className="text-sm text-[#717171]">{formatDate(pack.endDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#05073c]">Duration</p>
                      <p className="text-sm text-[#717171]">
                        {calculateDuration(pack.startDate, pack.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <UsersIcon className="w-5 h-5 text-[#05073c] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#05073c]">Max Clients</p>
                      <p className="text-sm text-[#717171]">
                        {pack.maxClients || "N/A"} people
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Destinations */}
            {pack.guidesPlacesId && pack.guidesPlacesId.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-[#05073c] mb-4">
                    Destinations Included
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pack.guidesPlacesId.map((place, index) => (
                      <div
                        key={place._id || index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {place.images && place.images[0] && (
                          <img
                            src={place.images[0]}
                            alt={place.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-[#05073c]">{place.name}</p>
                          <p className="text-sm text-[#717171]">
                            {place.city}, {place.country}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-[#05073c]">
                      ${pack.price}
                    </span>
                    <span className="text-sm text-[#717171]">per person</span>
                  </div>
                  
                  {pack.availability && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">Available</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#717171]">Duration:</span>
                    <span className="font-medium text-[#05073c]">
                      {calculateDuration(pack.startDate, pack.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#717171]">Max Group Size:</span>
                    <span className="font-medium text-[#05073c]">
                      {pack.maxClients} people
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  size="lg"
                  onClick={() => {
                    // This will be handled later - redirect to login if not authenticated
                    console.log("Book now clicked for pack:", pack._id);
                    alert("Booking functionality will be implemented soon!");
                  }}
                >
                  Book Now
                </Button>

                <p className="text-xs text-center text-[#717171] mt-4">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackDetailsPage;