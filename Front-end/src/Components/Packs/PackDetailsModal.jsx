"use client";

import React from "react";
import {
  X,
  Loader2,
  Calendar,
  MapPin,
  Crown,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Package,
  Image as ImageIcon,
} from "lucide-react";

export default function PackDetailsModal({ pack, loading, onClose, onEdit, onDelete }) {
  if (!pack && !loading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300" />

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
        ) : pack ? (
          <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
            {/* Left Side - Image & Quick Info */}
            <div className="lg:w-3/7 bg-primary p-8 flex flex-col items-center justify-center text-white">
              <div className="flex flex-col justify-between h-full w-full">
                {/* Pack Image */}
                <div className="flex justify-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={
                        pack.profileImg ||
                        "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/pack-placeholder_default.jpg"
                      }
                      alt={pack.title || "Pack"}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                    {pack.availability ? (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 px-4 py-1 rounded-full shadow-lg">
                        <span className="text-xs font-semibold text-white uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Available
                        </span>
                      </div>
                    ) : (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 px-4 py-1 rounded-full shadow-lg">
                        <span className="text-xs font-semibold text-white uppercase flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pack Title & Price */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {pack.title || "Pack Details"}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-3xl font-bold">{pack.price || 0} MAD</span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">per person</p>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-medium text-gray-600">
                      Quick Information
                    </p>

                    {/* Max Clients */}
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Max Clients</p>
                        <p className="font-semibold text-gray-900">
                          {pack.maxClients || 0} persons
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    {pack.durationTime && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">
                            {pack.durationTime} {pack.durationTime > 1 ? "days" : "day"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Average Rating */}
                    {pack.avgRating > 0 && (
                      <div className="flex items-center gap-3">
                        <Crown className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="font-semibold text-gray-900">
                            ⭐ {pack.avgRating} / 5
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="lg:w-4/7 flex flex-col">
              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Pack Details
                  </h2>
                  <div className="w-20 h-1 bg-[#EB662B] rounded-full"></div>
                </div>

                <div className="space-y-6">
                  {/* Description */}
                  {pack.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Description
                      </p>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {pack.description}
                      </p>
                    </div>
                  )}

                  {/* Locations */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      Route Information
                    </p>
                    <div className="flex items-center gap-5">
                      {pack.startLocation && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Start</p>
                            <span className="text-sm font-semibold text-gray-900">
                              {pack.startLocation}
                            </span>
                          </div>
                        </div>
                      )}
                      <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                      {pack.endLocation && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-500">End</p>
                            <span className="text-sm font-semibold text-gray-900">
                              {pack.endLocation}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trip Dates */}
                  {(pack.startDate || pack.endDate) && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Trip Duration
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {pack.startDate &&
                            new Date(pack.startDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          {pack.endDate && (
                            <>
                              {" - "}
                              {new Date(pack.endDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {pack.categories && pack.categories.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pack.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="border-t bg-gray-50 px-6 py-4">
                <div className="flex gap-3">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(pack._id)}
                      className="flex-1 bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      Edit Pack
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(pack)}
                      className="flex-1 bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Delete Pack
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No pack data available
          </div>
        )}
      </div>
    </div>
  );
}
