import React, { useState, useRef, useEffect } from "react";
import {
  EllipsisVertical,
  Trash2,
  Eye,
  Edit,
  Image,
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { deletePack } from "../../store/slices/packSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function CardPack({ pack }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
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

  // Add safety check for pack object
  if (!pack) return null;

  const handleDelete = async () => {
    try {
      await dispatch(deletePack(pack._id)).unwrap();

      // Show deletion toast with red theme
      toast(
        <div className="flex items-center w-full bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="p-2 bg-red-600/20 rounded-full mr-3">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Pack Deleted</p>
            <p className="text-red-100 text-sm">
              The pack has been permanently removed
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
      toast.error("Failed to delete pack", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative group">
      {/* Image Container */}
      <div className="relative mb-4 h-[200px] rounded-xl overflow-hidden bg-gray-100">
        {pack.profileImg ? (
          <img
            src={pack.profileImg}
            alt={pack.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Image className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-3 flex flex-col items-start">
        <div className="flex mt-2 mb-0 w-full items-center justify-between">
          <h3 className="font-semibold text-lg mb-0 text-gray-800">
            {pack.title}
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate(`/guide/packs/${pack._id}`)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate(`/guide/places/edit/${pack._id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Pack
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full gap-2 px-3 py-2 text-red-600 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pack Details */}
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold text-lg text-[#EB662B]">${pack.price}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{pack.startLocation} → {pack.endLocation}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {formatDate(pack.startDate)} - {formatDate(pack.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">Max {pack.maxClients} clients</span>
          </div>

          {pack.availability && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Available</span>
            </div>
          )}
        </div>

        {/* Description */}
        {pack.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {pack.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default CardPack;
