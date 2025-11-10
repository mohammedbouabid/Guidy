import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/components/ui/card";
import { Button } from "@/components/ui/components/ui/button";
import { 
  Users,
  UserCheck,
  MapPin,
  Package,
  Calendar,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Shield,
  ChevronRight,
  Crown,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { fetchUsers, fetchUserStats } from '@/store/slices/usersSlice';
import { fetchGuidePlaces } from '@/store/slices/guidePlaceSlice';
import { fetchPacks } from '@/store/slices/packSlice';
import { fetchAllBookings } from '@/store/slices/bookingSlice';
import { fetchRatings } from '@/store/slices/ratingSlice';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { users, guidesCount, clientsCount, totalUsersCount } = useSelector((state) => state.users);
  const { places, count: placesCount } = useSelector((state) => state.guidePlace);
  const { items: packItems, totalDocs: packsCount } = useSelector((state) => state.pack);
  const { items: bookingItems, totalDocs: bookingsCount } = useSelector((state) => state.booking);
  const { ratings, count: ratingsCount } = useSelector((state) => state.rating);
  const user = useSelector((state) => state.Auth);

  useEffect(() => {
    // Fetch user statistics from backend
    dispatch(fetchUserStats());
    // Fetch recent items for display
    dispatch(fetchUsers({ page: 1, limit: 10 }));
    dispatch(fetchGuidePlaces({ page: 1, limit: 100 }));
    dispatch(fetchPacks({ page: 1, limit: 100 }));
    dispatch(fetchAllBookings({ page: 1, limit: 100 }));
    dispatch(fetchRatings({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Calculate additional stats from all fetched items
  const activeBookings = bookingItems?.filter(b => !b.isCancelled && !b.isCompleted).length || 0;
  const completedBookings = bookingItems?.filter(b => b.isCompleted).length || 0;
  const cancelledBookings = bookingItems?.filter(b => b.isCancelled).length || 0;
  
  // Use real counts from backend
  const totalActiveBookings = activeBookings;
  const totalGuidesCount = guidesCount || 0;
  const totalClientsCount = clientsCount || 0;
  const totalUsers = totalUsersCount || 0;
  const totalPlacesCount = placesCount || 0;
  const totalRatingsCount = ratingsCount || 0;
  const averageRating = ratingsCount > 0 
    ? (ratings?.reduce((acc, r) => acc + r.stars, 0) / ratingsCount).toFixed(1) 
    : '0.0';

  const mainStats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "12.5%",
      trendUp: true,
      trendText: "vs last month",
      link: "/admin/clients",
      subtitle: `${totalGuidesCount} Guides, ${totalClientsCount} Clients`
    },
    {
      title: "Total Bookings",
      value: bookingsCount || 0,
      icon: Calendar,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "8.2%",
      trendUp: true,
      trendText: "vs last month",
      link: "/admin/bookings",
      subtitle: `${totalActiveBookings} Active`
    },
    {
      title: "Total Places",
      value: placesCount || 0,
      icon: MapPin,
      iconBg: "bg-orange-50",
      iconColor: "text-[#EB662B]",
      trend: "15.3%",
      trendUp: true,
      trendText: "vs last month",
      link: "/admin/destinations",
      subtitle: "Tourist destinations"
    },
    {
      title: "Total Packs",
      value: packsCount || 0,
      icon: Package,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "5.7%",
      trendUp: false,
      trendText: "vs last month",
      link: "/admin/destinations",
      subtitle: "Tour packages"
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: Star,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      trend: "0.3",
      trendUp: true,
      trendText: "points up",
      link: "/admin/ratings",
      subtitle: `${ratingsCount} reviews`
    },
    {
      title: "Active Guides",
      value: guidesCount,
      icon: UserCheck,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      trend: "6.1%",
      trendUp: true,
      trendText: "vs last month",
      link: "/admin/guides",
      subtitle: "Verified guides"
    }
  ];

  const quickActions = [
    {
      title: "View All Users",
      description: "Manage clients and guides",
      link: "/admin/clients",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      count: totalUsers
    },
    {
      title: "Manage Bookings",
      description: "Track and manage reservations",
      link: "/admin/bookings",
      icon: Calendar,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      count: totalActiveBookings
    },
    {
      title: "View Places",
      description: "Browse all destinations",
      link: "/admin/destinations",
      icon: MapPin,
      iconBg: "bg-orange-50",
      iconColor: "text-[#EB662B]",
      count: totalPlacesCount
    },
    {
      title: "Review Ratings",
      description: "Monitor customer feedback",
      link: "/admin/ratings",
      icon: Star,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      count: totalRatingsCount
    }
  ];

  const bookingStatusData = [
    {
      status: "Active",
      count: activeBookings,
      icon: Clock,
      color: "bg-blue-100 text-blue-700",
      percentage: bookingsCount > 0 ? ((activeBookings / bookingsCount) * 100).toFixed(1) : 0
    },
    {
      status: "Completed",
      count: completedBookings,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
      percentage: bookingsCount > 0 ? ((completedBookings / bookingsCount) * 100).toFixed(1) : 0
    },
    {
      status: "Cancelled",
      count: cancelledBookings,
      icon: XCircle,
      color: "bg-red-100 text-red-700",
      percentage: bookingsCount > 0 ? ((cancelledBookings / bookingsCount) * 100).toFixed(1) : 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-8 w-8 text-[#EB662B]" />
          <div className="h-1 w-12 bg-gradient-to-r from-[#EB662B] to-orange-400 rounded-full" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
          Welcome back, {user?.name || 'Administrator'} • Complete platform overview
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full"
            >
              <Link to={stat.link} className="h-full block group cursor-pointer">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#EB662B]/30 h-full flex flex-col relative overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium mb-2">{stat.title}</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1">{stat.subtitle}</p>
                    </div>
                    <div className={`${stat.iconBg} rounded-xl p-3 ring-4 ring-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor} transition-all duration-300`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs pt-3 border-t border-gray-100 mt-auto">
                    <div className={`flex items-center gap-1 font-semibold ${
                      stat.trendUp ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="h-3 w-3" />
                      <span>{stat.trend}</span>
                    </div>
                    <span className="text-gray-400">{stat.trendText}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Booking Status Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-[#EB662B]" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Booking Status Overview</h2>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          {bookingStatusData.map((item, index) => {
            const StatusIcon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="h-full"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 ${item.color} text-sm font-semibold rounded-full`}>
                      <StatusIcon className="w-4 h-4" />
                      {item.status}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                      className={`h-full ${item.color.replace('100', '500').replace('text', 'bg')}`}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.percentage}% of total bookings
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-[#EB662B]" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 min-[640px]:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -2 }}
                className="h-full"
              >
                <Link to={action.link} className="h-full block group cursor-pointer">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#EB662B]/30 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 ${action.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                        <Icon className={`h-7 w-7 ${action.iconColor}`} />
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl sm:text-3xl font-bold text-gray-900">{action.count}</span>
                        <span className="text-xs text-gray-400">Total</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-5 line-clamp-2 flex-1">
                      {action.description}
                    </p>

                    <div className="flex items-center gap-2 text-[#EB662B] font-semibold text-sm mt-auto group-hover:gap-3 transition-all duration-300">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">View Details</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity Sections */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Bookings */}
        {bookingItems && bookingItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#EB662B]" />
                Recent Bookings
              </h3>
              <Link to="/admin/bookings">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs font-semibold border-2 border-[#EB662B] text-[#EB662B] hover:bg-[#EB662B] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                >
                  View All
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-100">
                {[...bookingItems]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  .map((booking, index) => {
                    const getStatusBadge = () => {
                      if (booking.isCancelled) {
                        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Cancelled</span>;
                      }
                      if (booking.isCompleted) {
                        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Completed</span>;
                      }
                      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Active</span>;
                    };

                    return (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + index * 0.05 }}
                      >
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EB662B] to-orange-400 flex items-center justify-center text-white font-bold">
                              {booking.userID?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 truncate text-sm">
                                  {booking.userID?.name || 'N/A'}
                                </p>
                                {booking.isVip && <Crown className="w-3 h-3 text-yellow-500" />}
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {booking.packID?.title || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Users */}
        {users && users.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#EB662B]" />
                Recent Users
              </h3>
              <Link to="/admin/clients">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs font-semibold border-2 border-[#EB662B] text-[#EB662B] hover:bg-[#EB662B] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                >
                  View All
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-100">
                {[...users]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  .map((user, index) => {
                    const getRoleBadge = () => {
                      if (user.role === 'guide') {
                        return <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">Guide</span>;
                      }
                      if (user.role === 'admin') {
                        return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Admin</span>;
                      }
                      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Client</span>;
                    };

                    return (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + index * 0.05 }}
                      >
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                              {user.profileImage ? (
                                <img 
                                  src={user.profileImage} 
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {user.name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-sm">
                                {user.name || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getRoleBadge()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
