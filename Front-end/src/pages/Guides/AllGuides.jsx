import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Package, Mail, Calendar, Home, Search } from 'lucide-react';
import { fetchAllGuidesPublic } from '@/store/slices/usersSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AllGuides = () => {
  const dispatch = useDispatch();
  const { guides, guidesLoading } = useSelector((state) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByPacks, setFilterByPacks] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    dispatch(fetchAllGuidesPublic());
  }, [dispatch]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, filterByPacks]);

  // Filter and sort guides
  const filteredGuides = useMemo(() => {
    if (!guides) return [];

    let filtered = [...guides];

    // Search by name or email
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(guide => 
        guide.name?.toLowerCase().includes(search) || 
        guide.email?.toLowerCase().includes(search)
      );
    }

    // Filter by number of packs
    if (filterByPacks === 'hasPackages') {
      filtered = filtered.filter(guide => guide.packsCount > 0);
    } else if (filterByPacks === 'noPackages') {
      filtered = filtered.filter(guide => guide.packsCount === 0);
    } else if (filterByPacks === 'moreThan5') {
      filtered = filtered.filter(guide => guide.packsCount > 5);
    }

    return filtered;
  }, [guides, searchTerm, filterByPacks]);

  // Get visible guides
  const visibleGuides = filteredGuides.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGuides.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, filteredGuides.length));
  };

  if (guidesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="h-12 w-64 bg-gray-200 animate-pulse rounded-lg mb-4" />
          <div className="h-6 w-96 bg-gray-200 animate-pulse rounded mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EB662B] mb-6 transition-colors group"
        >
          <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Our Expert <span className="text-[#EB662B]">Guides</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the experienced guides who will make your Moroccan adventure unforgettable
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#EB662B]">{filteredGuides?.length || 0}</div>
              <div className="text-sm text-gray-600">Expert Guides</div>
            </div>
            <div className="h-12 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#EB662B]">
                {filteredGuides?.reduce((sum, guide) => sum + guide.packsCount, 0) || 0}
              </div>
              <div className="text-sm text-gray-600">Total Packages</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-5xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-3">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-[#EB662B] focus:ring-2 focus:ring-[#EB662B]/20 focus:outline-none transition-all text-sm"
              />
            </div>

            {/* Filter Select - shadcn/ui */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={filterByPacks} onValueChange={setFilterByPacks}>
                <SelectTrigger className="w-full sm:w-[200px] h-[42px] border-gray-200 focus:border-[#EB662B] focus:ring-[#EB662B]/20">
                  <SelectValue placeholder="Filter by packages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Guides</SelectItem>
                  <SelectItem value="hasPackages">Has Packages</SelectItem>
                  <SelectItem value="noPackages">No Packages</SelectItem>
                  <SelectItem value="moreThan5">5+ Packages</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Button */}
              {(searchTerm || filterByPacks !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterByPacks('all');
                    setVisibleCount(12);
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-[#EB662B] transition-colors whitespace-nowrap font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center text-xs text-gray-500">
            Showing {visibleGuides.length} of {filteredGuides.length} guides
          </div>
        </motion.div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleGuides?.map((guide, index) => (
            <motion.div
              key={guide._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/guide/${guide._id}`}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#EB662B]/50">
                  {/* Guide Header */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-[#EB662B]/30 transition-all">
                        <img
                          src={guide.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                          alt={guide.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-[#EB662B] rounded-full p-1.5">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#EB662B] transition-colors capitalize mb-1">
                        {guide.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{guide.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {new Date(guide.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-[#EB662B]/10 to-orange-100/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#EB662B] rounded-lg p-2">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Packages Created</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {guide.packsCount}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-[#EB662B] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        View Profile →
                      </div>
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EB662B]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!guidesLoading && filteredGuides?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterByPacks !== 'all' ? 'No Guides Found' : 'No Guides Yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterByPacks !== 'all' 
                ? 'Try adjusting your filters or search term' 
                : 'Check back soon for our expert guides'}
            </p>
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && !guidesLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={loadMore}
              className="px-8 py-4 bg-[#EB662B] text-white font-semibold rounded-full hover:bg-[#d55a24] transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group"
            >
              <span>Load More Guides</span>
              <Package className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            <p className="text-sm text-gray-600 mt-4">
              {filteredGuides.length - visibleCount} more guides available
            </p>
          </motion.div>
        )}

        {/* All Loaded Message */}
        {!hasMore && visibleGuides.length > 0 && visibleGuides.length === filteredGuides.length && filteredGuides.length > 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12 py-8 border-t-2 border-gray-200"
          >
            <p className="text-gray-600 font-medium">
              ✨ You've viewed all {filteredGuides.length} guides
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllGuides;
