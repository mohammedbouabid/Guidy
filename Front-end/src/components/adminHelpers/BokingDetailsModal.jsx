"use client";

import React from "react";
import {
  X,
  Loader2,
  XCircle,
  Calendar,
  User,
  Package,
  MapPin,
  Crown,
  Users,
  CheckCircle2,
  Clock,
  Bolt,
  ArrowRight,
  ArrowRightLeft,
  Mail,
  Phone,
} from "lucide-react";

export default function BookingDetailsModal({ booking, loading, onClose }) {
  if (!booking && !loading) return null;

  const getStatusDisplay = () => {
    if (booking.isCancelled) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100">
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 font-semibold">Cancelled</span>
        </div>
      );
    }
    if (booking.isCompleted) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-semibold">Completed</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100">
        <Clock className="w-5 h-5 text-blue-600" />
        <span className="text-blue-700 font-semibold">Active</span>
      </div>
    );
  };

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
        ) : booking ? (
          <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
            <div className="lg:w-3/7 bg-gradient-to-br from-[#EB662B] to-[#ff8c5a] p-8 flex flex-col items-center justify-center text-white">
              <div className="flex flex-col justify-between h-full">
                <div className="flex justify-between gap-4">
                  {/* Avatar */}
                  <div className="relative inline-block mb-6">
                    <img
                      src={
                        booking.userID.profileImage ||
                        "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"
                      }
                      alt={booking.userID.name || "Client"}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg">
                      <span className="text-xs font-semibold text-[var(--accent)] uppercase">
                        {booking.userID.role || "Client"}
                      </span>
                    </div>
                  </div>
                  {/* Client Details */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-2xl font-bold mb-1">
                      {booking.userID?.name || "Anonymous User"}
                    </h3>
                    <p className="text-white/80 flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      {booking.userID?.email || "No email provided"}
                    </p>
                    <p className="text-white/80 flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      {booking.userID?.phone || "No phone provided"}
                    </p>
                  </div>
                </div>
                {/* Booking Details */}
                <div className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg h-full">
                  <div className="flex flex-col gap-5">
                    <p className="text-sm font-medium text-gray-600">
                      Booking Information
                    </p>

                    {/* Spots Booked */}
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Spots Reserved</p>
                        <p className="font-semibold text-gray-900">
                          {booking.spotsBooked || 1}{" "}
                          {booking.spotsBooked > 1 ? "Spots" : "Spot"}
                        </p>
                      </div>
                    </div>

                    {/* Booking Date */}
                    {booking.createdAt && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500">Booked On</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Total Price Calculation */}
                  {booking.packID?.price && (
                    <div className="pt-3 mt-3 border-t border-gray-200">
                      <div className="flex flex-col justify-between ">
                        <span className="text-sm font-medium text-gray-600">
                          Total Amount
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {(
                            booking.packID.price * (booking.spotsBooked || 1)
                          ).toFixed(2)}{" "}
                          MAD
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:w-4/7 flex flex-col">
              <div className=" p-6 overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Booking Details
                  </h2>
                  <div className="w-20 h-1 bg-[#EB662B] rounded-full"></div>
                </div>

                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    {getStatusDisplay()}
                    {booking.isVip ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-100">
                        <Crown className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-700 font-semibold">
                          VIP
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100">
                        <Bolt className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700 font-semibold">Regular</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row"></div>

                  {/* Info Grid */}
                  <div className="grid">
                    {/* Pack Info */}
                    {booking.packID && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              Package Details
                            </p>
                            <p className="text-gray-900 font-bold text-lg mb-2">
                              {booking.packID.title || "N/A"}
                            </p>

                            {/* Price */}
                            {booking.packID.price && (
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-green-600 font-bold text-xl">
                                  {booking.packID.price} MAD
                                </span>
                                <span className="text-gray-500 text-sm">
                                  per person
                                </span>
                              </div>
                            )}

                            {/* Locations */}
                            <div className=" flex items-center gap-5">
                              {booking.packID.startLocation && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm">
                                    {booking.packID.startLocation}
                                  </span>
                                </div>
                              )}
                              <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                              {booking.packID.endLocation && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-red-600" />
                                  <span className="text-sm">
                                    {booking.packID.endLocation}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Trip Dates */}
                            {(booking.packID.startDate ||
                              booking.packID.endDate) && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                  Trip Duration
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <span>
                                    {booking.packID.startDate &&
                                      new Date(
                                        booking.packID.startDate
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    {booking.packID.endDate && (
                                      <>
                                        {" "}
                                        -{" "}
                                        {new Date(
                                          booking.packID.endDate
                                        ).toLocaleDateString("en-GB", {
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
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="border-t bg-gray-50 px-6 py-4">
                <div className="flex gap-3">
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
            No booking data available
          </div>
        )}
      </div>
    </div>
  );
}
