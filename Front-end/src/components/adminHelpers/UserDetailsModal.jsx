"use client";

import React from "react";
import {
  X,
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Shield,
  Trash2,
} from "lucide-react";

export default function UserDetailsModal({
  user,
  loading,
  onClose,
  onDelete,
  deleteLoading,
}) {
  if (!user && !loading) return null;

  const handleDelete = () => {
    if (user && user._id) {
      onDelete(user._id);
    }
  };

  const isDeleting = deleteLoading && user && deleteLoading[user._id];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300" />

      <div
        className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
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
        ) : user ? (
          <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
            {/* Profile Image Section */}
            <div className="lg:w-1/2 h-[300px] lg:h-auto bg-gradient-to-br from-[var(--accent)] to-orange-600 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <img
                    src={
                      user.profileImage ||
                      "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"
                    }
                    alt={user.name || "User"}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg">
                    <span className="text-xs font-semibold text-[var(--accent)] uppercase">
                      {user.role || "User"}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user.name || "N/A"}
                </h2>
                {user.email && (
                  <p className="text-white/90 text-sm">{user.email}</p>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  User Information
                </h3>

                <div className="space-y-5">
                  {/* Email */}
                  {user.email && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail className="w-6 h-6 text-[var(--accent)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          Email Address
                        </p>
                        <p className="text-gray-800 font-semibold break-words">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-6 h-6 text-[var(--accent)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* CIN */}
                  {user.cin !== undefined && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <CreditCard className="w-6 h-6 text-[var(--accent)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          CIN Number
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {user.cin || "Not provided"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Role */}
                  {user.role && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Shield className="w-6 h-6 text-[var(--accent)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          User Role
                        </p>
                        <p className="text-gray-800 font-semibold capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Joined Date */}
                  {user.createdAt && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-6 h-6 text-[var(--accent)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          Member Since
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="border-t bg-gray-50 px-6 py-4">
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting || loading}
                    className="flex-1 border-2 border-red-600 text-red-600 font-bold py-2.5 px-4 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete {user.role || "User"}
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-[var(--accent)] text-white font-bold py-2.5 px-4 rounded-lg hover:bg-[var(--accent)]/90 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No user data available
          </div>
        )}
      </div>
    </div>
  );
}
