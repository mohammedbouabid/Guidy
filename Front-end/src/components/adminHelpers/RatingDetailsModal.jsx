"use client";

import React from "react";
import {
  X,
  Loader2,
  Trash2,
  Calendar,
  Package,
  Star,
  MessageSquare,
  DollarSign,
  Mail,
  Shield,
  Phone,
  ArrowRightLeft,
  MapPin,
  Clock,
} from "lucide-react";

export default function RatingDetailsModal({
  rating,
  loading,
  onClose,
  onDelete,
  deleteLoading,
}) {
  if (!rating && !loading) return null;

  const handleDelete = () => {
    if (rating && rating._id) {
      onDelete(rating._id);
    }
  };

  const isDeleting = deleteLoading && rating && deleteLoading[rating._id];

  const renderStars = (stars) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-6 h-6 ${
              index < stars
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-3 text-2xl font-bold text-gray-800">{stars}.0</span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" />

      <div
        className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : rating ? (
          <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
            {/* Profile Section - Left Side */}
            <div className="lg:w-2/5 bg-gradient-to-br from-[#EB662B] to-[#ff8c5a] p-8 flex flex-col items-center justify-center text-white">
              <div className="text-center space-y-6">
                <div className="flex justify-between">
                  {/* Avatar */}
                  <div className="relative inline-block mb-6">
                    <img
                      src={
                        rating.clientID.profileImage ||
                        "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"
                      }
                      alt={rating.clientID.name || "Client"}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg">
                      <span className="text-xs font-semibold text-[var(--accent)] uppercase">
                        {rating.clientID.role || "Client"}
                      </span>
                    </div>
                  </div>
                  {/* Client Details */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-2xl font-bold mb-1">
                      {rating.clientID?.name || "Anonymous User"}
                    </h3>
                    <p className="text-white/80 flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      {rating.clientID?.email || "No email provided"}
                    </p>
                    <p className="text-white/80 flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      {rating.clientID?.phone || "No phone provided"}
                    </p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <p className="text-sm text-white/80 mb-3 font-medium">
                    Rating Given
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-7 h-7 ${
                          index < rating.stars
                            ? "fill-white text-white"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-4xl font-bold mt-3">
                    {rating.stars}.0<span className="text-xl">/5</span>
                  </p>
                </div>

                {/* Submission Date */}
                {rating.createdAt && (
                  <div className="flex gap-6 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(rating.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {rating.createdAt &&
                            new Date(rating.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section - Right Side */}
            <div className="lg:w-3/5 flex flex-col">
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Rating Details
                  </h2>
                  <div className="w-20 h-1 bg-[#EB662B] rounded-full"></div>
                </div>

                <div className="space-y-6">
                  {/* Comment Section */}
                  {rating.comment && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 shadow-sm">
                      <div className="flex items-center justify-between">
                        {renderStars(rating.stars)}
                        {rating.createdAt && (
                          <div className="flex gap-6">
                            <div className="flex items-center justify-center gap-2 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(rating.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>
                                {rating.createdAt &&
                                  new Date(rating.createdAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="">
                        <p className="text-gray-700 leading-relaxed text-base italic">
                          "{rating.comment}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="border-t bg-gray-50 px-8 py-5">
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting || loading}
                    className="flex-1 border-2 border-red-500 text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Delete Rating
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-[#EB662B] text-white font-bold py-2.5 px-4 rounded-lg hover:bg-[#EB662B]/90 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No rating data available
          </div>
        )}
      </div>
    </div>
  );
}
