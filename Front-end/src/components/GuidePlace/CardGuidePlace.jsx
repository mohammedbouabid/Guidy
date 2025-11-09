import React, { useState, useRef, useEffect } from "react";
import {
  EllipsisVertical,
  Trash2,
  Eye,
  Edit,
  Image,
  CheckCircle,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GuideDetailsModal from "./GuideDetailsModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useDispatch } from "react-redux";
import { deleteGuidePlace } from "../../store/slices/guidePlaceSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function CardGuidePlace({ place }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, placeId: null, placeName: '' });
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

  // Add safety check for place object
  if (!place) return null;

  const handleDeleteClick = () => {
    setDeleteDialog({
      isOpen: true,
      placeId: place._id,
      placeName: place.name
    });
    setShowActions(false);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteGuidePlace(deleteDialog.placeId)).unwrap();

      // Show deletion toast with red theme
      toast(
        <div className="flex items-center w-full bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="p-2 bg-red-600/20 rounded-full mr-3">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Guide Place Deleted</p>
            <p className="text-red-100 text-sm">
              The place has been permanently removed
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "transparent",
            border: "none",
            padding: "0",
            boxShadow: "none",
          },
        }
      );
    } catch (error) {
      toast.error("Failed to delete place", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative group">
      {/* Image Container */}
      <div className="relative mb-3 h-[200px] rounded-lg overflow-hidden bg-gray-100">
        {/* Add safety check for images array */}
        {Array.isArray(place.images) && place.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="h-full w-full"
          >
            {place.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${place.name} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Image className="w-10 h-10 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-1.5 flex flex-col items-start">
        <div className="flex mt-1.5 mb-0 w-full items-center justify-between">
          <h3 className="font-semibold text-base mb-0 text-gray-800">
            {place.name}
          </h3>

          {/* Actions Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
            >
              <EllipsisVertical className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10  border">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => setShowDetails(true)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700  cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate(`/guide/places/edit/${place._id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Place
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center w-full gap-2 px-3 py-2 text-red-600 hover:bg-gray-100 cursor-pointer  rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="">
          <span className="text-[#EB662B] font-bold text-base mb-0">
            {place.city}
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
      </div>

      {/* Guide Information */}
      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t">
        <img
          src={place.guideID.profileImage || "/default-avatar.png"}
          alt={`${place.guideID.firstName} ${place.guideID.lastName}`}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-sm text-gray-800">
            {place.guideID.firstName} {place.guideID.lastName}
          </h4>
          <p className="text-xs text-gray-500">{place.guideID.email}</p>
        </div>
      </div>

      {/* Modal */}
      <GuideDetailsModal
        place={place}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, placeId: null, placeName: '' })}
        onConfirm={handleDelete}
        title="Supprimer le lieu"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteDialog.placeName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
}

export default CardGuidePlace;
