"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/adminTable/data-table";
import {
  fetchBookingsAdmin,
  fetchBookingById,
  setSearchValue,
  setCurrentPage,
  setSortConfig,
  setIsVipFilter,
  setStatusFilter,
  setDateFilter,
  clearSelectedBooking,
} from "@/store/slices/bookingSlice";
import { User, Package, Calendar, Clock, Crown, XCircle, CheckCircle, Users, Bolt, Route } from "lucide-react";
import BookingDetailsModal from "@/components/adminHelpers/BokingDetailsModal";

export default function BookingsPage() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const {
    items,
    loading,
    deleteLoading,
    page: currentPage,
    totalPages,
    totalDocs,
    searchValue,
    sortField,
    sortOrder,
    isVipFilter,
    statusFilter,
    dateFilter,
    limit,
    current: selectedBooking,
    bookingLoading,
  } = useSelector((state) => state.booking);

  // Use items directly from Redux (no client-side filtering)
  const bookings = items || [];

  // Set default sorting on mount
  useEffect(() => {
    if (!sortField) {
      dispatch(setSortConfig({ field: "createdAt", order: "desc" }));
    }
  }, []);

  // Fetch bookings whenever filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: limit || 10,
    };

    if (searchValue) params.search = searchValue;
    if (sortField) params.sortField = sortField;
    if (sortOrder) params.sortOrder = sortOrder;
    if (isVipFilter !== "") params.isVip = isVipFilter;
    if (statusFilter !== "") params.statusFilter = statusFilter;
    if (dateFilter) params.dateFilter = dateFilter;

    dispatch(fetchBookingsAdmin(params));
  }, [
    dispatch,
    currentPage,
    limit,
    searchValue,
    sortField,
    sortOrder,
    isVipFilter,
    statusFilter,
    dateFilter,
  ]);

  const handleSearchChange = (value) => {
    dispatch(setSearchValue(value));
    if (currentPage !== 1) {
      dispatch(setCurrentPage(1));
    }
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleSortChange = (field, order) => {
    dispatch(setSortConfig({ field, order }));
    if (currentPage !== 1) {
      dispatch(setCurrentPage(1));
    }
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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-600 mt-2">
          View and manage all trip bookings ({totalDocs} total)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by client, pack title, or location..."
        loading={loading}
        deleteLoading={deleteLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        currentSort={{ field: sortField, order: sortOrder }}
        filters={filters}
        onView={handleView}
        emptyMessage="No bookings found"
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