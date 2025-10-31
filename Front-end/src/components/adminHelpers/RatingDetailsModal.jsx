"use client";

import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
    X,
    Loader2,
    Trash2,
    Calendar,
    User,
    Package,
    Star,
    MessageSquare,
    DollarSign,
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
                        className={`w-5 h-5 ${
                            index < stars
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="ml-2 text-lg font-bold text-gray-700">{stars}/5</span>
            </div>
        );
    };

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
                        {/* Pack Images Section */}
                        <div className="lg:w-2/5 h-[250px] lg:h-auto bg-gray-100">
                            {rating.packID?.images && rating.packID.images.length > 0 ? (
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
                                    {rating.packID.images.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={image}
                                                alt={`${rating.packID.title} - Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <Package className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="lg:w-3/5 flex flex-col">
                            <div className="flex-1 p-6 overflow-y-auto">
                                <h2 className="text-2xl font-bold text-[#EB662B] mb-6">
                                    Rating Details
                                </h2>
                                
                                <div className="space-y-6">
                                    {/* Stars Rating */}
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600 mb-2">Rating</p>
                                        {renderStars(rating.stars)}
                                    </div>

                                    {/* Comment */}
                                    {rating.comment && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-start gap-2 mb-2">
                                                <MessageSquare className="w-5 h-5 text-[#EB662B] mt-0.5 flex-shrink-0" />
                                                <p className="text-sm font-medium text-gray-600">Comment</p>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed ml-7">
                                                {rating.comment}
                                            </p>
                                        </div>
                                    )}

                                    {/* Info Grid */}
                                    <div className="grid gap-4">
                                        {/* Client Info */}
                                        {rating.clientID && (
                                            <div className="flex items-start space-x-3 text-gray-600 border-l-4 border-[#EB662B] pl-4">
                                                <User className="w-5 h-5 text-[#EB662B] mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-600">Client</p>
                                                    <p className="text-gray-900 font-semibold">
                                                        {rating.clientID.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {rating.clientID.email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Pack Info */}
                                        {rating.packID && (
                                            <div className="flex items-start space-x-3 text-gray-600 border-l-4 border-blue-500 pl-4">
                                                <Package className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-600">Package</p>
                                                    <p className="text-gray-900 font-semibold">
                                                        {rating.packID.title || 'N/A'}
                                                    </p>
                                                    {rating.packID.price && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <DollarSign className="w-4 h-4 text-green-600" />
                                                            <span className="text-green-600 font-bold">
                                                                ${rating.packID.price}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Created Date */}
                                        {rating.createdAt && (
                                            <div className="flex items-center space-x-3 text-gray-600">
                                                <Calendar className="w-5 h-5 text-[#EB662B]" />
                                                <div>
                                                    <p className="text-sm font-medium">Submitted On</p>
                                                    <p className="text-gray-500">
                                                        {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
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