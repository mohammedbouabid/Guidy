import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { X, MapPin, Calendar, User, Building, Globe } from 'lucide-react';


function GuideDetailsModal({ place, onClose, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4  cursor-pointer top-4 z-10 p-2 rounded-full hover:bg-gray-100 duration-300   transition-colors "
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Images Section */}
          <div className="lg:w-1/2">
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
              className="h-[300px] lg:h-full swiper-container"
            >
              {Array.isArray(place.images) && place.images.map((image, index) => (
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
                {/* Location with line */}
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

                <div className="flex items-center space-x-3 text-gray-600">
                  <Building className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">City</p>
                    <p className="text-gray-500">{place.city}Casablanca</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Globe className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">Country</p>
                    <p className="text-gray-500">{place.country}Morocco</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="w-5 h-5 text-[#EB662B]" />
                  <div>
                    <p className="text-sm font-medium">Guide</p>
                    <p className="text-gray-500">{ place.guideID.email || 'Guide Name'}</p>
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