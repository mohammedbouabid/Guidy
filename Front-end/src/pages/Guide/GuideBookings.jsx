"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/adminTable/data-table";
import {
  fetchGuideBookings,
  fetchBookingById,
  setSearchValue,
  setCurrentPage,
  setSortConfig,
  setIsVipFilter,
  setStatusFilter,
  setDateFilter,
  clearSelectedBooking,
} from "@/store/slices/bookingSlice";
import { User, Calendar, Clock, Crown, XCircle, CheckCircle, Users, Bolt, Route } from "lucide-react";
import BookingDetailsModal from "@/components/adminHelpers/BokingDetailsModal";

export default function GuideBookings() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const {
    items,
    loading,
    deleteLoading,
    searchValue,
    sortField,
    sortOrder,
    isVipFilter,
    statusFilter,
    dateFilter,
    current: selectedBooking,
    bookingLoading,
  } = useSelector((state) => state.booking);

  // Client-side pagination state
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all bookings once on mount (no filters sent to backend)
  useEffect(() => {
    dispatch(fetchGuideBookings({ page: 1, limit: 1000 })); // Fetch all bookings
  }, [dispatch]);

  // Set default sorting on mount
  useEffect(() => {
    if (!sortField) {
      dispatch(setSortConfig({ field: "createdAt", order: "desc" }));
    }
  }, []);

  // Client-side filtering and sorting
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...(items || [])];

    // Apply search filter (includes ALL fields displayed in table)
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((booking) => {
        // Client fields
        const userName = booking.userID?.name?.toLowerCase() || "";
        const userEmail = booking.userID?.email?.toLowerCase() || "";
        const userPhone = booking.userID?.phone?.toLowerCase() || "";
        
        // Pack/Tour fields
        const packTitle = booking.packID?.title?.toLowerCase() || "";
        const startLocation = booking.packID?.startLocation?.toLowerCase() || "";
        const endLocation = booking.packID?.endLocation?.toLowerCase() || "";
        const packPrice = booking.packID?.price?.toString() || "";
        
        // Booking fields
        const spots = booking.spotsBooked?.toString() || "";
        const vipStatus = booking.isVip ? "vip" : "regular";
        const status = booking.isCancelled ? "cancelled" : booking.isCompleted ? "completed" : "active";
        
        // Date fields
        const createdDate = booking.createdAt 
          ? new Date(booking.createdAt).toLocaleDateString("en-GB").toLowerCase()
          : "";
        const startDate = booking.packID?.startDate
          ? new Date(booking.packID.startDate).toLocaleDateString("en-GB").toLowerCase()
          : "";
        const endDate = booking.packID?.endDate
          ? new Date(booking.packID.endDate).toLocaleDateString("en-GB").toLowerCase()
          : "";
        
        return (
          userName.includes(searchLower) ||
          userEmail.includes(searchLower) ||
          userPhone.includes(searchLower) ||
          packTitle.includes(searchLower) ||
          startLocation.includes(searchLower) ||
          endLocation.includes(searchLower) ||
          packPrice.includes(searchLower) ||
          spots.includes(searchLower) ||
          vipStatus.includes(searchLower) ||
          status.includes(searchLower) ||
          createdDate.includes(searchLower) ||
          startDate.includes(searchLower) ||
          endDate.includes(searchLower)
        );
      });
    }

    // Apply VIP filter
    if (isVipFilter === "true") {
      filtered = filtered.filter((booking) => booking.isVip === true);
    } else if (isVipFilter === "false") {
      filtered = filtered.filter((booking) => !booking.isVip);
    }

    // Apply status filter
    if (statusFilter === "cancelled") {
      filtered = filtered.filter((booking) => booking.isCancelled === true);
    } else if (statusFilter === "completed") {
      filtered = filtered.filter((booking) => booking.isCompleted === true);
    } else if (statusFilter === "active") {
      filtered = filtered.filter((booking) => !booking.isCancelled && !booking.isCompleted);
    }

    // Apply date filter
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        
        switch (dateFilter) {
          case "today":
            return bookingDate >= today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return bookingDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return bookingDate >= monthAgo;
          case "year":
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return bookingDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          case "userID":
            aValue = a.userID?.name || "";
            bValue = b.userID?.name || "";
            break;
          case "packID":
            aValue = a.packID?.title || "";
            bValue = b.packID?.title || "";
            break;
          case "spotsBooked":
            aValue = a.spotsBooked || 0;
            bValue = b.spotsBooked || 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [items, searchValue, isVipFilter, statusFilter, dateFilter, sortField, sortOrder]);

  // Client-side pagination
  const totalFilteredDocs = filteredAndSortedBookings.length;
  const totalClientPages = Math.ceil(totalFilteredDocs / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (clientPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedBookings.slice(startIndex, endIndex);
  }, [filteredAndSortedBookings, clientPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setClientPage(1);
  }, [searchValue, isVipFilter, statusFilter, dateFilter]);

  const handleSearchChange = (value) => {
    dispatch(setSearchValue(value));
  };

  const handlePageChange = (page) => {
    setClientPage(page);
  };

  const handleSortChange = (field, order) => {
    dispatch(setSortConfig({ field, order }));
  };

  const handleView = async (id) => {
    setShowModal(true);
    await dispatch(fetchBookingById(id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedBooking());
  };

  const columns = [
    {
      accessorKey: "userID",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {row.original.userID?.name || "N/A"}
            </span>
            <span className="text-xs text-gray-500">
              {row.original.userID?.email || ""}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "packID",
      header: "Tour",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="flex flex-col truncate">
            <span className="font-medium truncate max-w-[180px]">
              {row.original.packID?.title || "N/A"}
            </span>
            <span className="text-xs text-green-600 font-semibold">
              {row.original.packID?.price || 0} MAD
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "spotsBooked",
      header: "Spots",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-700">
            {row.original.spotsBooked || 1}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "isVip",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.isVip ? (
            <>
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-yellow-600">VIP</span>
            </>
          ) : (
            <>
              <Bolt className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-600">Regular</span>
            </>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isCancelled",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        if (row.original.isCancelled) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              <XCircle className="w-3 h-3" />
              Cancelled
            </span>
          );
        }
        if (row.original.isCompleted) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3" />
              Completed
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3" />
            Active
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Booked On",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm">
              {date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        );
      },
    },
  ];

  const filters = [
    {
      label: "VIP Status",
      mobileLabel: "VIP",
      icon: Crown,
      value: isVipFilter,
      onChange: (value) => dispatch(setIsVipFilter(value)),
      getLabel: () => {
        if (isVipFilter === "true") return "VIP Only";
        if (isVipFilter === "false") return "Regular Only";
        return "All Types";
      },
      options: [
        { label: "All Types", value: "" },
        { label: "VIP Only", value: "true" },
        { label: "Regular Only", value: "false" },
      ],
    },
    {
      label: "Status",
      mobileLabel: "Status",
      icon: CheckCircle,
      value: statusFilter,
      onChange: (value) => dispatch(setStatusFilter(value)),
      getLabel: () => {
        switch(statusFilter) {
          case "active": return "Active";
          case "completed": return "Completed";
          case "cancelled": return "Cancelled";
          default: return "All Status";
        }
      },
      options: [
        { label: "All Status", value: "" },
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      label: "Date",
      mobileLabel: "Period",
      icon: Clock,
      value: dateFilter,
      onChange: (value) => dispatch(setDateFilter(value)),
      getLabel: () => {
        switch(dateFilter) {
          case "today": return "Today";
          case "week": return "This Week";
          case "month": return "This Month";
          case "year": return "This Year";
          default: return "All Time";
        }
      },
      options: [
        { label: "All Time", value: "" },
        { label: "Today", value: "today" },
        { label: "This Week", value: "week" },
        { label: "This Month", value: "month" },
        { label: "This Year", value: "year" },
      ],
    },
  ];

  return (
    <div className="container mx-auto ">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          View and manage all your trip bookings ({totalFilteredDocs} total)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={paginatedBookings}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by client, pack title, or location..."
        loading={loading}
        deleteLoading={deleteLoading}
        currentPage={clientPage}
        totalPages={totalClientPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        currentSort={{ field: sortField, order: sortOrder }}
        filters={filters}
        onView={handleView}
        emptyMessage="No bookings found"
        showActions={true}
      />

      {showModal && (
        <BookingDetailsModal
          booking={selectedBooking}
          loading={bookingLoading}
          onClose={handleCloseModal}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
}
