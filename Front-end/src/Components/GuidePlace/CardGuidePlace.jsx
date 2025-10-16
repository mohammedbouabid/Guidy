import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Trash2, Eye, Edit } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GuideDetailsModal from './GuideDetailsModal';

function CardGuidePlace({ place }) {
  const [showActions, setShowActions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative group">
        {/* Swiper Container */}
        <div className="relative mb-4 h-[250px] rounded-xl overflow-hidden bg-gray-100">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="h-full w-full object-cover"
          >
            {place.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${place.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="space-y-2 flex flex-col items-start">
          <div className="flex mt-2 w-full items-center justify-between">
            <h3 className="font-semibold  text-lg mb-0 text-gray-800">
              {place.name}
            </h3>

            {/* Actions Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
              >
                <EllipsisVertical className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10  border">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowDetails(true)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => console.log("Edit")}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Place
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => console.log("Delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="">
            <span className="text-[#EB662B] font-bold text-lg mb-0">
              ${place.price}
            </span>
          </div>
          {/* <div className="flex items-center space-x-1">
          Star Rating
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${
                  index < 4 ? "text-[#EB662B]" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">(15)</span>
        </div> */}

          {/* Edit Button */}
          <button className=" 
        px-5 cursor-pointer  duration-300   bg-[#E2EAF8] py-2  font-medium  text-sm rounded-md text-gray-600 hover:text-[#EB662B] transition-colors">
            Edit Place
          </button>
        </div>
      </div>

      {/* Modal */}
      <GuideDetailsModal 
        place={place}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}

export default CardGuidePlace;
