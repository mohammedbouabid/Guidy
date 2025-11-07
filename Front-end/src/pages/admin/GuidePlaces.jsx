"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/adminTable/data-table";
import {
  fetchGuidePlaces,
  deleteGuidePlace,
  getGuidePlaceById,
  setSearchValue,
  setCurrentPage,
  setSortConfig,
  setCityFilter,
  setCountryFilter,
  clearSelectedPlace,
} from "@/store/slices/guidePlaceSlice";
import { Globe, Building2, User, Calendar } from "lucide-react";
import Swal from "sweetalert2";
import GuidePlaceDetailsModal from "@/components/adminHelpers/GuidePlaceDetailsModal";

export default function GuidePlacesPage() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const {
    places,
    loading,
    deleteLoading,
    currentPage,
    totalPages,
    searchValue,
    sortField,
    sortOrder,
    cityFilter,
    countryFilter,
    limit,
    selectedPlace,
    placeLoading,
  } = useSelector((state) => state.guidePlace);

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
        fetchGuidePlaces({
          page: currentPage,
          limit,
          search: searchValue,
          sortField,
          sortOrder,
          city: cityFilter,
          country: countryFilter,
        })
      );
    }, searchValue);

    return () => clearTimeout(timer);
  }, [
    dispatch,
    currentPage,
    limit,
    searchValue,
    sortField,
    sortOrder,
    cityFilter,
    countryFilter,
  ]);

  const handleSearchChange = (value) => {
    dispatch(setSearchValue(value));
    // Reset to page 1 when searching
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
      text: "You want to delete this place",
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
        await dispatch(deleteGuidePlace(id)).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Place deleted successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to delete the place.", "error");
      }
    }
  };

  const handleView = async (id) => {
    setShowModal(true);
    await dispatch(getGuidePlaceById(id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedPlace());
  };

  const handleDeleteFromModal = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this place",
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
        await dispatch(deleteGuidePlace(id)).unwrap();
        handleCloseModal();
        Swal.fire({
          title: "Deleted!",
          text: "Place deleted successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to delete the place.", "error");
      }
    }
  };

  // Extract unique cities and countries for filters
  const cities = [...new Set(places.map((p) => p.city).filter(Boolean))];
  const countries = [...new Set(places.map((p) => p.country).filter(Boolean))];

  const columns = [
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {row.original.name}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[200px]">
            {row.original.description}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "guideID",
      header: "Guide Owner",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate">
            {row.original.guideID?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "images",
      header: "Images",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.images?.slice(0, 2).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${row.original.name} ${idx + 1}`}
              className="w-10 h-10 rounded object-cover"
            />
          ))}
          {row.original.images?.length > 2 && (
            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-600">
              +{row.original.images.length - 2}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span>{row.original.city}</span>
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span>{row.original.country}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>
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
      label: "City",
      mobileLabel: "City",
      icon: Building2,
      value: cityFilter,
      onChange: (value) => dispatch(setCityFilter(value)),
      getLabel: () => cityFilter || "All Cities",
      options: [
        { label: "All Cities", value: "" },
        ...cities.map((city) => ({ label: city, value: city })),
      ],
    },
    {
      label: "Country",
      mobileLabel: "Country",
      icon: Globe,
      value: countryFilter,
      onChange: (value) => dispatch(setCountryFilter(value)),
      getLabel: () => countryFilter || "All Countries",
      options: [
        { label: "All Countries", value: "" },
        ...countries.map((country) => ({ label: country, value: country })),
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
        <p className="text-gray-600 mt-2">
          Manage tourist spots and destinations
        </p>
      </div>

      <DataTable
        columns={columns}
        data={places}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
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
        emptyMessage="Aucun lieu trouvé"
      />

      {showModal && (
        <GuidePlaceDetailsModal
          place={selectedPlace}
          loading={placeLoading}
          onClose={handleCloseModal}
          onDelete={handleDeleteFromModal}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
}
