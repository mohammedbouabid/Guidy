import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Package } from 'lucide-react';
import { fetchPublicStats } from '@/store/slices/usersSlice';

const TravelStatsSection = () => {
  const dispatch = useDispatch();
  
  const { guidesCount, packsCount, placesCount } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchPublicStats());
  }, [dispatch]);

  const stats = [
    {
      icon: MapPin,
      value: placesCount || 0,
      label: 'Total Destinations',
      delay: 0.2,
      position: 'top-left' // Position comme dans l'image
    },
    {
      icon: Package,
      value: packsCount || 0,
      label: 'Amazing Tours',
      delay: 0.4,
      position: 'top-right' // Position comme dans l'image
    },
    {
      icon: Users,
      value: guidesCount || 0,
      label: 'Total Guides',
      delay: 0.6,
      position: 'bottom-left' // Position comme dans l'image (plus grande)
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#EB662B] to-orange-600 py-20 lg:py-28 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              We Make<br />
              <span className="text-white/90">World Travel Easy</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
              Traveling under your own power and at your own pace, you'll connect more meaningfully with your destination and have more fun!
            </p>

            <Link to="/filter">
              <button className="bg-white text-[#EB662B] font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2">
                Explore Our Tours
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </motion.div>

          {/* Right Stats Cards - Layout EXACT comme l'image */}
          <div className="flex gap-5 items-center justify-center">
            {/* Left Column - 2 cards empilées */}
            <div className="flex flex-col gap-5">
              {/* Card 1 - Total Destinations (Top) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center text-center  w-60 h-50"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white border-2 border-[#EB662B] rounded-full mb-3">
                  <MapPin className="w-6 h-6 text-[#EB662B]" />
                </div>
                <div className="text-4xl font-bold text-[#EB662B] mb-2">
                  {placesCount}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Total Destinations
                </div>
              </motion.div>

              {/* Card 3 - Total Guides (Bottom) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center text-center w-60 h-50"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white border-2 border-[#EB662B] rounded-full mb-3">
                  <Users className="w-6 h-6 text-[#EB662B]" />
                </div>
                <div className="text-4xl font-bold text-[#EB662B] mb-2">
                  {(guidesCount || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Total Guides
                </div>
              </motion.div>
            </div>

            {/* Right Column - 1 card centrée au milieu */}
            {/* Card 2 - Amazing Tours (Centrée verticalement) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center text-center  w-60 h-50"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white border-2 border-[#EB662B] rounded-full mb-3">
                <Package className="w-6 h-6 text-[#EB662B]" />
              </div>
              <div className="text-4xl font-bold text-[#EB662B] mb-2">
                {(packsCount || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                Amazing Tours
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelStatsSection;
