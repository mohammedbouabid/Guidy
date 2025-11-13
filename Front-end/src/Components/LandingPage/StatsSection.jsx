import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchUserStats } from '@/store/slices/usersSlice';
import { fetchGuidePlaces } from '@/store/slices/guidePlaceSlice';
import { fetchRatings } from '@/store/slices/ratingSlice';
import { fetchAllBookings } from '@/store/slices/bookingSlice';

const StatsSection = () => {
  const dispatch = useDispatch();
  const { totalUsersCount, guidesCount } = useSelector((state) => state.users);
  const { count: placesCount } = useSelector((state) => state.guidePlace);
  const { count: ratingsCount } = useSelector((state) => state.rating);
  const { totalDocs: bookingsCount } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchGuidePlaces({ page: 1, limit: 1 }));
    dispatch(fetchRatings({ page: 1, limit: 1 }));
    dispatch(fetchAllBookings({ page: 1, limit: 1 }));
  }, [dispatch]);

  const stats = [
    {
      value: totalUsersCount || 0,
      label: 'Happy Travelers',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      borderColor: 'border-blue-500/20',
      shadowColor: 'shadow-blue-500/10'
    },
    {
      value: guidesCount || 0,
      label: 'Expert Guides',
      gradient: 'from-[#EB662B] via-orange-600 to-red-600',
      borderColor: 'border-orange-500/20',
      shadowColor: 'shadow-orange-500/10'
    },
    {
      value: placesCount || 0,
      label: 'Destinations',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      borderColor: 'border-emerald-500/20',
      shadowColor: 'shadow-emerald-500/10'
    },
    {
      value: ratingsCount || 0,
      label: 'Reviews',
      gradient: 'from-amber-500 via-yellow-600 to-orange-500',
      borderColor: 'border-amber-500/20',
      shadowColor: 'shadow-amber-500/10'
    }
  ];

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #EB662B 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-[#EB662B] to-orange-600 text-white text-sm font-semibold rounded-full">
              Our Impact
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-[#EB662B] to-orange-600 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of satisfied travelers exploring Morocco
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className={`relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 ${stat.borderColor} ${stat.shadowColor} shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Animated Border Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Value Counter Animation */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1 + 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="mb-3"
                  >
                    <div className={`text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent leading-none`}>
                      {(stat.value || 0).toLocaleString()}
                      <span className="text-4xl sm:text-5xl lg:text-6xl">+</span>
                    </div>
                  </motion.div>

                  {/* Label */}
                  <div className="space-y-2">
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${stat.gradient} group-hover:w-full transition-all duration-500`} />
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      {stat.label}
                    </p>
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute -top-6 -right-6 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${stat.gradient} blur-2xl`} />
                </div>
              </div>

              {/* Floating Animation on Hover */}
              <motion.div
                className="absolute inset-0 -z-10"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 text-lg mb-4">
            Be part of our growing community
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EB662B] to-orange-600 border-2 border-white" />
              ))}
            </div>
            <span>Join {totalUsersCount}+ happy travelers</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
