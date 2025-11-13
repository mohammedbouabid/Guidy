import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  MapPin, 
  Clock, 
  Users as UsersIcon, 
  Star,
  ArrowLeft 
} from 'lucide-react';
import { fetchGuideProfile } from '@/store/slices/usersSlice';

const GuideProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedGuide, guidePacks, guideProfileLoading, guideProfileError } = useSelector((state) => state.users);

  useEffect(() => {
    if (id) {
      dispatch(fetchGuideProfile(id));
    }
  }, [dispatch, id]);

  if (guideProfileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-64" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
                </div>
              </div>
            </div>

            {/* Packs Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (guideProfileError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-red-900 mb-2">Guide Not Found</h2>
              <p className="text-red-700 mb-6">{guideProfileError}</p>
              <Link to="/guides" className="inline-flex items-center gap-2 px-6 py-3 bg-[#EB662B] text-white font-semibold rounded-full hover:bg-[#d55a24] transition-all">
                <ArrowLeft className="w-5 h-5" />
                Back to Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Links */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EB662B] transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/guides" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EB662B] transition-colors">
              <span className="font-medium">All Guides</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium capitalize">{selectedGuide?.name || 'Guide Profile'}</span>
          </div>

          {/* Guide Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 shadow-xl mb-8 overflow-hidden relative"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#EB662B]/10 to-transparent rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#EB662B]/20 shadow-xl">
                  <img
                    src={selectedGuide?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                    alt={selectedGuide?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#EB662B] rounded-full p-3 shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 capitalize">
                  {selectedGuide?.name}
                </h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5 text-[#EB662B]" />
                    <span className="text-sm">{selectedGuide?.email}</span>
                  </div>
                  
                  {selectedGuide?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5 text-[#EB662B]" />
                      <span className="text-sm">{selectedGuide.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-[#EB662B]" />
                    <span className="text-sm">
                      Joined {new Date(selectedGuide?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-5 h-5 text-[#EB662B]" />
                    <span className="text-sm font-semibold">{selectedGuide?.packsCount} Packages</span>
                  </div>
                </div>

                {/* Stats Banner */}
                <div className="bg-gradient-to-r from-[#EB662B] to-orange-600 rounded-xl p-4 inline-block">
                  <div className="text-white text-sm font-semibold">
                     Expert Guide • {guidePacks?.length || 0} Tours Available
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Packages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Available <span className="text-[#EB662B]">Packages</span>
              </h2>
              <div className="text-gray-600">
                {guidePacks?.length || 0} {guidePacks?.length === 1 ? 'package' : 'packages'}
              </div>
            </div>

            {guidePacks && guidePacks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guidePacks.map((pack, index) => (
                  <motion.div
                    key={pack._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/packs/${pack._id}`}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#EB662B]/50">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={pack.profileImg || 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4'}
                            alt={pack.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Price Badge */}
                          <div className="absolute top-4 right-4 bg-[#EB662B] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                            {pack.price ? `${pack.price} DH` : 'Contact'}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#EB662B] transition-colors">
                            {pack.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {pack.description}
                          </p>

                          {/* Destinations */}
                          {pack.guidesPlacesId && pack.guidesPlacesId.length > 0 && (
                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                              <MapPin className="w-4 h-4 text-[#EB662B]" />
                              <span className="text-sm">
                                {pack.guidesPlacesId[0].city && pack.guidesPlacesId[0].country 
                                  ? `${pack.guidesPlacesId[0].city}, ${pack.guidesPlacesId[0].country}`
                                  : pack.guidesPlacesId[0].location || 'Morocco'}
                              </span>
                              {pack.guidesPlacesId.length > 1 && (
                                <span className="text-xs text-gray-500">
                                  +{pack.guidesPlacesId.length - 1} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                            {pack.startDate && pack.endDate && (
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Clock className="w-4 h-4 text-[#EB662B]" />
                                <span className="text-sm">
                                  {Math.ceil((new Date(pack.endDate) - new Date(pack.startDate)) / (1000 * 60 * 60 * 24))} days
                                </span>
                              </div>
                            )}

                            {pack.maxPeople && (
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <UsersIcon className="w-4 h-4 text-[#EB662B]" />
                                <span className="text-sm">Max {pack.maxPeople}</span>
                              </div>
                            )}

                            {pack.startDate && (
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Calendar className="w-4 h-4 text-[#EB662B]" />
                                <span className="text-sm">
                                  {new Date(pack.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Packages Yet</h3>
                <p className="text-gray-600">This guide hasn't created any packages yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
