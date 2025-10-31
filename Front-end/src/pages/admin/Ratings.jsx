"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/adminTable/data-table";
import {
  fetchRatings,
  deleteRating,
  getRatingById,
  setSearchValue,
  setCurrentPage,
  setSortConfig,
  setStarsFilter,
  setDateFilter,
  clearSelectedRating,
} from "@/store/slices/ratingSlice";
import { Star, User, Package, Calendar, Clock } from "lucide-react";
import Swal from "sweetalert2";
import RatingDetailsModal from "@/components/adminHelpers/RatingDetailsModal";

export default function RatingsPage() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const {
    ratings,
    loading,
    deleteLoading,
    currentPage,
    totalPages,
    searchValue,
    sortField,
    sortOrder,
    starsFilter,
    dateFilter,
    limit,
    selectedRating,
    ratingLoading,
  } = useSelector((state) => state.rating);

  // Set default sorting on mount
  useEffect(() => {
    if (!sortField) {
      dispatch(setSortConfig({ field: "createdAt", order: "desc" }));
    }
  }, []);

  // Single useEffect with debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchRatings({
          page: currentPage,
          limit,
          search: searchValue,
          sortField,
          sortOrder,
          stars: starsFilter,
          dateFilter: dateFilter,
        })
      );
    }, searchValue ? 500 : 0);

    return () => clearTimeout(timer);
  }, [
    dispatch,
    currentPage,
    limit,
    searchValue,
    sortField,
    sortOrder,
    starsFilter,
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
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this rating",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        confirmButton:
          "border border-red-600 text-red-600 font-bold px-4 py-2 rounded-md mb-5 w-sm cursor-pointer",
        cancelButton:
          "bg-red-600 text-white font-bold px-4 py-2 rounded-md w-sm cursor-pointer",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteRating(id)).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Rating deleted successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to delete the rating.", "error");
      }
    }
  };

  const handleView = async (id) => {
    setShowModal(true);
    await dispatch(getRatingById(id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedRating());
  };

  const handleDeleteFromModal = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this rating",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        confirmButton:
          "border border-red-600 text-red-600 font-bold px-4 py-2 rounded-md mb-5 w-sm cursor-pointer",
        cancelButton:
          "bg-red-600 text-white font-bold px-4 py-2 rounded-md w-sm cursor-pointer",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteRating(id)).unwrap();
        handleCloseModal();
        Swal.fire({
          title: "Deleted!",
          text: "Rating deleted successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to delete the rating.", "error");
      }
    }
  };

  const renderStars = (stars) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < stars
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold text-gray-700">{stars}</span>
      </div>
    );
  };

  const columns = [
    {
      accessorKey: "clientID",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {row.original.clientID?.name || "N/A"}
            </span>
            <span className="text-xs text-gray-500">
              {row.original.clientID?.email || ""}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "packID",
      header: "Pack",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate max-w-[200px]">
            {row.original.packID?.title || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "stars",
      header: "Rating",
      cell: ({ row }) => renderStars(row.original.stars),
    },
    {
      accessorKey: "comment",
      header: "Comment",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="text-sm text-gray-600 line-clamp-2">
            {row.original.comment || "No comment"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
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
      label: "Rating",
      mobileLabel: "Stars",
      icon: Star,
      value: starsFilter,
      onChange: (value) => dispatch(setStarsFilter(value)),
      getLabel: () => starsFilter ? `${starsFilter} Stars` : "All Ratings",
      options: [
        { label: "All Ratings", value: "" },
        { label: "5 Stars", value: "5" },
        { label: "4 Stars", value: "4" },
        { label: "3 Stars", value: "3" },
        { label: "2 Stars", value: "2" },
        { label: "1 Star", value: "1" },
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
        <h1 className="text-3xl font-bold text-gray-900">Ratings Management</h1>
        <p className="text-gray-600 mt-2">
          View and manage customer reviews and ratings
        </p>
      </div>

      <DataTable
        columns={columns}
        data={ratings}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by comment, pack title, client name or email..."
        loading={loading}
        deleteLoading={deleteLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        currentSort={{ field: sortField, order: sortOrder }}
        filters={filters}
        onDelete={handleDelete}
        onView={handleView}
        emptyMessage="No ratings found"
      />

      {showModal && (
        <RatingDetailsModal
          rating={selectedRating}
          loading={ratingLoading}
          onClose={handleCloseModal}
          onDelete={handleDeleteFromModal}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
}