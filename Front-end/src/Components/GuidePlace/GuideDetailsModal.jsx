import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { X, MapPin, Calendar, User, Building, Globe } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

function GuideDetailsModal({ place, onClose, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Images Section */}
          <div className="lg:w-1/2">
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              className="h-[300px] lg:h-full"
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
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#EB662B] mb-6">{place.name}</h2>
            
            <div className="space-y-6">
              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{place.description}</p>
              </div>

              {/* Info Grid */}
              <div className="grid gap-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-gray-500">{place.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Building className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">City</p>
                    <p className="text-gray-500">{place.city}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Globe className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">Country</p>
                    <p className="text-gray-500">{place.country}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">Guide</p>
                    <p className="text-gray-500">{place.guideName || 'Guide Name'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-gray-500">
                      {new Date(place.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideDetailsModal;