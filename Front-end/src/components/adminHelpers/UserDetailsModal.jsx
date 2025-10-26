"use client";

import React from "react";
import {
  X,
  Loader2,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : user ? (
            <div className="flex justify-around items-center">
              {/* Profile Image and Name */}
              <div className="flex flex-col items-center">
                <img
                  src={
                    user.profileImage ||
                    "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"
                  }
                  alt={user.name || "User"}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[var(--accent)]"
                />
                <h3 className="text-2xl font-bold text-gray-800">
                  {user.name || "N/A"}
                </h3>
                <p className="text-sm text-[var(--accent)] mt-1 capitalize">
                  {user.role || "User"}
                </p>
              </div>

              {/* User Information */}
              <div className="flex flex-col items-left gap-6">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800 break-words font-semibold">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-800 font-semibold">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* CIN */}
                {user.cin !== undefined && (
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">CIN</p>
                      <p className="text-gray-800 font-semibold">
                        {user.cin || "Not provided"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Joined Date */}
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      Joined On
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
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

        {/* Footer */}
        {user && (
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting || loading}
                className="flex-1 border-4 border-red-600 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete {user.role}
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[var(--accent)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--accent)]/80 transition-colors font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
