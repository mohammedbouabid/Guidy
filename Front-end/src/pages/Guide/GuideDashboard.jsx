import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/components/ui/card";
import { Button } from "@/components/ui/components/ui/button";
import { 
  ArrowRight,
  ChevronRight,
  Circle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Package,
  Calendar,
  Award,
  User,
  Crown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { fetchGuidePlacesForGuide } from '@/store/slices/guidePlaceSlice';
import { fetchGuidePacks } from '@/store/slices/packSlice';
import { fetchGuideBookings } from '@/store/slices/bookingSlice';

const GuideDashboard = () => {
  const dispatch = useDispatch();
  const { placesForGuide } = useSelector((state) => state.guidePlace);
  const { items: packItems } = useSelector((state) => state.pack);
  const { items: bookingItems } = useSelector((state) => state.booking);
  const user = useSelector((state) => state.Auth);

  useEffect(() => {
    dispatch(fetchGuidePlacesForGuide());
    dispatch(fetchGuidePacks());
    dispatch(fetchGuideBookings());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Places",
      value: placesForGuide?.length || 0,
      icon: MapPin,
      iconBg: "bg-orange-50",
      iconColor: "text-[#EB662B]",
      trend: "8.5%",
      trendUp: true,
      trendText: "Up from yesterday",
      link: "/guide/places"
    },
    {
      title: "Total Packs",
      value: packItems?.length || 0,
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "1.3%",
      trendUp: true,
      trendText: "Up from past week",
      link: "/guide/PacksGuide"
    },
    {
      title: "Total Bookings",
      value: bookingItems?.length || 0,
      icon: Calendar,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "4.3%",
      trendUp: false,
      trendText: "Down yesterday",
      link: "/guide/bookingsGuide"
    },
    {
      title: "Total Visitors",
      value: ((placesForGuide?.length || 0) + (packItems?.length || 0)) * 25,
      icon: Award,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "12.8%",
      trendUp: true,
      trendText: "Up from this month",
      link: "#"
    }
  ];

  const quickActions = [
    {
      title: "New Place",
      description: "Add a destination",
      link: "/guide/places/add",
      icon: MapPin,
      iconBg: "bg-orange-50",
      iconColor: "text-[#EB662B]"
    },
    {
      title: "New Pack",
      description: "Create a tour package",
      link: "/guide/packs/add",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Bookings",
      description: "Manage reservations",
      link: "/guide/bookingsGuide",
      icon: Calendar,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-1 w-12 bg-[#EB662B] rounded-full" />
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dashboard</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name || 'Guide'}
        </h1>
        <p className="text-gray-600">
          Manage your tourism activity
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link to={stat.link}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                    <div className={`${stat.iconBg} rounded-full p-3`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                      <TrendIcon className="h-3 w-3" />
                      <span className="font-semibold">{stat.trend}</span>
                    </div>
                    <span className="text-gray-500">{stat.trendText}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link to={action.link}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <Icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {action.description}
                    </p>

                    <div className="flex items-center gap-2 text-[#EB662B] font-semibold text-sm">
                      <span>Get Started</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Bookings */}
      {bookingItems && bookingItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/guide/bookingsGuide">
              <Button 
                variant="outline" 
                className="text-sm cursor-pointer font-semibold border-[#EB662B] text-[#EB662B] hover:bg-orange-50"
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {[...bookingItems]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                .map((booking, index) => {
                  const getStatusBadge = () => {
                    if (booking.isCancelled) {
                      return (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          <XCircle className="w-3 h-3" />
                          Cancelled
                        </span>
                      );
                    }
                    if (booking.isCompleted) {
                      return (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      );
                    }
                    return (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        <Calendar className="w-3 h-3" />
                        Active
                      </span>
                    );
                  };

                  return (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                    >
                      <Link to="/guide/bookingsGuide">
                        <div className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-4 flex-1">
                            {/* User Avatar */}
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                              {booking.userID?.profileImage ? (
                                <img 
                                  src={booking.userID.profileImage} 
                                  alt={booking.userID?.name || 'User'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="h-6 w-6 text-gray-400" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {booking.userID?.name || 'N/A'}
                                </h3>
                                {booking.isVip && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {booking.packID?.title || 'N/A'} • {booking.spotsBooked || 1} spot{booking.spotsBooked > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="hidden md:block">
                              {getStatusBadge()}
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GuideDashboard;
