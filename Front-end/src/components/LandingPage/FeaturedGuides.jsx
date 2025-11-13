import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/components/ui/button";
import { fetchFeaturedGuides } from "@/store/slices/usersSlice";

const FeaturedGuides = () => {
  const dispatch = useDispatch();
  const { featuredGuides, guidesLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchFeaturedGuides());
  }, [dispatch]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
                  <h2 className="text-2xl text-center  sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Featured <span className="text-[#EB662B]">Guides</span>
          </h2>

        {/* Guides Grid */}
        {guidesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 animate-pulse mb-3" />
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {featuredGuides?.map((guide) => (
              <Link
                key={guide._id}
                to={`/guide/${guide._id}`}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md mb-3 group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-[#EB662B]/50">
                  <img
                    src={guide.profileImage || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-semibold text-[#05073c] group-hover:text-[#EB662B] transition-colors capitalize">
                  {guide.name}
                </h3>
                <p className="text-xs text-gray-500">{guide.packsCount} packs</p>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom "See All" Button */}
        <div className="flex justify-center">
          <Link to="/guides">
            <Button
              variant="ghost"
              className="h-auto cursor-pointer px-0 py-0 text-sm sm:text-base text-[#05073c] hover:text-[#EB662B] hover:bg-transparent group"
            >
              <span className="mr-1">See all guides</span>
              <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuides;
