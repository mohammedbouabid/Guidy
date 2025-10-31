"use client";

import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
    X,
    Loader2,
    MapPin,
    Globe,
    Building2,
    Trash2,
    Calendar,
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
            />
            
            <div
                className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
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
                ) : place ? (
                    <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                        {/* Images Section */}
                        <div className="lg:w-1/2 h-[300px] lg:h-auto">
                            {place.images && place.images.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, EffectFade, Autoplay]}
                                    navigation={true}
                                    pagination={{ 
                                        clickable: true,
                                        dynamicBullets: true
                                    }}
                                    effect="fade"
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    loop={true}
                                    className="h-full swiper-container"
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
                            ) : (
                                <div className="h-full flex items-center justify-center bg-gray-100">
                                    <p className="text-gray-400">No images available</p>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="lg:w-1/2 flex flex-col">
                            <div className="flex-1 p-6 overflow-y-auto">
                                <h2 className="text-2xl font-bold text-[#EB662B] mb-6">
                                    {place.name || "N/A"}
                                </h2>
                                
                                <div className="space-y-6">
                                    {/* Description */}
                                    {place.description && (
                                        <div className="prose max-w-none">
                                            <p className="text-gray-700 leading-relaxed">
                                                {place.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Info Grid */}
                                    <div className="grid gap-4">
                                        {/* Location */}
                                        {place.location && (
                                            <div className="flex items-start space-x-3 text-gray-600">
                                                <MapPin className="w-5 h-5 text-[#EB662B] mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Location</p>
                                                    <a 
                                                        href={`https://maps.google.com/?q=${encodeURIComponent(place.location)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-500 hover:text-[#EB662B] transition-colors line-clamp-2 border-b border-dashed border-gray-300 pb-1 break-words"
                                                    >
                                                        {place.location}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* City */}
                                        {place.city && (
                                            <div className="flex items-center space-x-3 text-gray-600">
                                                <Building2 className="w-5 h-5 text-[#EB662B]" />
                                                <div>
                                                    <p className="text-sm font-medium">City</p>
                                                    <p className="text-gray-500">{place.city}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Country */}
                                        {place.country && (
                                            <div className="flex items-center space-x-3 text-gray-600">
                                                <Globe className="w-5 h-5 text-[#EB662B]" />
                                                <div>
                                                    <p className="text-sm font-medium">Country</p>
                                                    <p className="text-gray-500">{place.country}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Guide Owner */}
                                        {place.guideID && (
                                            <div className="flex items-center space-x-3 text-gray-600">
                                                <User className="w-5 h-5 text-[#EB662B]" />
                                                <div>
                                                    <p className="text-sm font-medium">Guide Owner</p>
                                                    <p className="text-gray-500 capitalize">
                                                        {place.guideID?.name || place.guideID?.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Created Date */}
                                        {place.createdAt && (
                                            <div className="flex items-start space-x-3 text-gray-600">
                                                <Calendar className="w-5 h-5 text-[#EB662B]" />
                                                <div>
                                                    <p className="text-sm font-medium">Created On</p>
                                                    <p className="text-gray-500">
                                                        {new Date(place.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
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
                                                Delete Place
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
                        No place data available
                    </div>
                )}
            </div>
        </div>
    );
}