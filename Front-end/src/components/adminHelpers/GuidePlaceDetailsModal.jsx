"use client";

import React from "react";
import {
    X,
    Loader2,
    MapPin,
    Globe,
    Building2,
    Trash2,
    Calendar,
    FileText,
    Image as ImageIcon,
    User,
} from "lucide-react";

export default function GuidePlaceDetailsModal({
    place,
    loading,
    onClose,
    onDelete,
    deleteLoading,
}) {
    if (!place && !loading) return null;

    const handleDelete = () => {
        if (place && place._id) {
            onDelete(place._id);
        }
    };

    const isDeleting = deleteLoading && place && deleteLoading[place._id];

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
                className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Guide Place Details</h2>
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
                    ) : place ? (
                        <div className="space-y-6">
                            {/* Place Name */}
                            <div className="border-b pb-4 flex flex-col gap-3">
                                <div className="flex flex-row justify-between gap-3">
                                    {/* Guide Owner */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500">Guide Owner</p>
                                            <p className="text-gray-800 font-semibold mt-1 capitalize">
                                                {place.guideID?.name || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Created Date */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500">Created On</p>
                                            <p className="text-gray-800 font-semibold mt-1">
                                                {place.createdAt
                                                    ? new Date(place.createdAt).toLocaleDateString("en-GB", {
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

                            {/* Main Content */}
                            <div className="flex flex-col content-around gap-6">
                                {/* Right Column - Images */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ImageIcon className="w-5 h-5 text-gray-600" />
                                        <p className="text-sm font-medium text-gray-500">Images</p>
                                    </div>
                                    {place.images && place.images.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {place.images.map((img, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={img}
                                                        alt={`${place.name} ${idx + 1}`}
                                                        className="w-full h-60 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                                            No images available
                                        </div>
                                    )}
                                </div>
                                {/* Left Column */}
                                <div className="space-y-4 grid grid-cols-3 gap-4">
                                    <h3 className="text-2xl font-bold text-gray-800 col-span-3">
                                        {place.name || "N/A"}
                                    </h3>
                                    {/* Description */}
                                    <div className="flex items-start gap-3 col-span-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500">Description</p>
                                            <p className="text-gray-800 break-words mt-1">
                                                {place.description || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* City */}
                                    <div className="flex items-start gap-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Building2 className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500">City</p>
                                            <p className="text-gray-800 font-semibold mt-1">
                                                {place.city || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Country */}
                                    <div className="flex items-start gap-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <Globe className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500">Country</p>
                                            <p className="text-gray-800 font-semibold mt-1">
                                                {place.country || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Location */}
                                    <div className="flex items-start gap-3 col-span-2">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500">Location</p>
                                            <p className="text-gray-800 font-semibold mt-1">
                                                {place.location || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No place data available
                        </div>
                    )}
                </div>

                {/* Footer */}
                {place && (
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
                                        Delete Place
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

