"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPacks, fetchPackById, deletePack } from "@/store/slices/packSlice";
import { fetchAllBookings } from "@/store/slices/bookingSlice";
import { DataTable } from "@/components/adminTable/data-table";
import PackDetailsModal from "@/components/Packs/PackDetailsModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  MapPin,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "@/utils/toastNotifications.jsx";

const PacksAdmin = () => {
  const dispatch = useDispatch();
  const { items: packs = [], loading } = useSelector((state) => state.pack);
  const bookingItems = useSelector((state) => state.booking?.items || []);

  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [clientPage, setClientPage] = useState(1);
  const [currentPack, setCurrentPack] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, pack: null });
  const [deleteLoading, setDeleteLoading] = useState({});

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPacks({ page: 1, limit: 1000 }));
    dispatch(fetchAllBookings({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const packsWithAvailability = useMemo(() => {
    return packs.map((pack) => {
      const bookedSpots = bookingItems
        .filter(
          (booking) =>
            (booking.packID?._id || booking.packID) === pack._id &&
            booking.isCancelled !== true
        )
        .reduce((sum, booking) => sum + (booking.spotsBooked || 0), 0);

      return {
        ...pack,
        bookedSpots,
        availableSpots: Math.max(0, (pack.maxClients || 0) - bookedSpots),
      };
    });
  }, [packs, bookingItems]);

  const filteredPacks = useMemo(() => {
    let list = [...packsWithAvailability];

    if (searchValue) {
      const query = searchValue.toLowerCase();
      const dateText = (value) =>
        value ? format(new Date(value), "dd MMM yyyy").toLowerCase() : "";

      list = list.filter((pack) => {
        const safe = (val) => (val ? String(val).toLowerCase() : "");
        return (
          safe(pack.title).includes(query) ||
          safe(pack.description).includes(query) ||
          safe(pack.startLocation).includes(query) ||
          safe(pack.endLocation).includes(query) ||
          safe(pack.price).includes(query) ||
          safe(pack.maxClients).includes(query) ||
          safe((pack.categories || []).join(" ")).includes(query) ||
          dateText(pack.startDate).includes(query) ||
          dateText(pack.endDate).includes(query)
        );
      });
    }

    if (availabilityFilter === "available") {
      list = list.filter((pack) => pack.availability === true);
    } else if (availabilityFilter === "unavailable") {
      list = list.filter((pack) => pack.availability === false);
    }

    if (priceFilter === "low") {
      list = list.filter((pack) => pack.price < 500);
    } else if (priceFilter === "medium") {
      list = list.filter(
        (pack) => pack.price >= 500 && pack.price <= 1500
      );
    } else if (priceFilter === "high") {
      list = list.filter((pack) => pack.price > 1500);
    }

    if (sortField && sortOrder) {
      list.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "startDate" || sortField === "endDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (
          sortField === "title" ||
          sortField === "startLocation" ||
          sortField === "endLocation"
        ) {
          aValue = (aValue || "").toLowerCase();
          bValue = (bValue || "").toLowerCase();
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [
    packsWithAvailability,
    searchValue,
    availabilityFilter,
    priceFilter,
    sortField,
    sortOrder,
  ]);

  const totalFiltered = filteredPacks.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const paginatedPacks = filteredPacks.slice(
    (clientPage - 1) * itemsPerPage,
    clientPage * itemsPerPage
  );

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setClientPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortField(field || "startDate");
    setSortOrder(order || "desc");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setClientPage(page);
  };

const handleView = async (packId) => {
  const basePack = packs.find((p) => p._id === packId);
  if (!basePack) return;
  setCurrentPack(basePack);
  setShowDetailsModal(true);
  try {
    const details = await dispatch(fetchPackById(packId)).unwrap();
    setCurrentPack(details);
  } catch {
    // ignore
  }
};

  const openDeleteDialog = (pack) => {
    setDeleteDialog({ isOpen: true, pack });
  };

  const handleDeleteConfirm = async () => {
    const pack = deleteDialog.pack;
    if (!pack?._id) return;
    setDeleteLoading((prev) => ({ ...prev, [pack._id]: true }));
    try {
      await dispatch(deletePack(pack._id)).unwrap();
      showSuccessToast("Pack deleted successfully", `"${pack.title}" has been removed.`);
      setDeleteDialog({ isOpen: false, pack: null });
      setShowDetailsModal(false);
    } catch (error) {
      showErrorToast(error?.message || "Failed to delete pack");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [pack._id]: false }));
    }
  };

  const columns = [
    {
      id: "pack",
      header: "Pack",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 border">
            <img
              src={
                row.original.profileImg ||
                "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/pack-placeholder_default.jpg"
              }
              alt={row.original.title || "Pack"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 truncate max-w-[220px]">
          {row.original.title || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-semibold text-[#22c55e]">
          ${" "}
          {Number(row.original.price || 0).toLocaleString(undefined, {
            minimumFractionDigits: 0,
          })}{" "}
          MAD
        </span>
      ),
    },
    {
      accessorKey: "maxClients",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-gray-700 font-semibold">
          <Users className="w-4 h-4 text-gray-500" />
          <span>{row.original.maxClients || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "availableSpots",
      header: "Available",
      cell: ({ row }) => {
        const available = row.original.availableSpots || 0;
        const isLow = available <= 3 && available > 0;
        const isEmpty = available === 0;
        const color = isEmpty
          ? "text-red-600"
          : isLow
          ? "text-orange-600"
          : "text-blue-600";

        return (
          <div className={`flex items-center gap-1 font-semibold ${color}`}>
            <Users className={`w-4 h-4 ${color}`} />
            <span>{available}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "availability",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            row.original.availability
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.availability ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {row.original.availability ? "Available" : "Unavailable"}
        </div>
      ),
    },
    {
      accessorKey: "route",
      header: "Route",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs">
          <MapPin className="w-3 h-3 text-blue-600" />
          <span className="truncate max-w-[90px]">
            {row.original.startLocation || "N/A"}
          </span>
          <span>&rarr;</span>
          <MapPin className="w-3 h-3 text-red-600" />
          <span className="truncate max-w-[90px]">
            {row.original.endLocation || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6b7280]" />
          {row.original.startDate
            ? format(new Date(row.original.startDate), "dd MMM yyyy")
            : "N/A"}
        </div>
      ),
    },
  ];

  const filters = [
    {
      label: "Availability",
      mobileLabel: "Status",
      icon: Package,
      value: availabilityFilter,
      onChange: setAvailabilityFilter,
      getLabel: () => {
        if (availabilityFilter === "available") return "Available";
        if (availabilityFilter === "unavailable") return "Unavailable";
        return "All Status";
      },
      options: [
        { label: "All Status", value: "" },
        { label: "Available", value: "available" },
        { label: "Unavailable", value: "unavailable" },
      ],
    },
    {
      label: "Price Range",
      mobileLabel: "Price",
      icon: DollarSign,
      value: priceFilter,
      onChange: setPriceFilter,
      getLabel: () => {
        switch (priceFilter) {
          case "low":
            return "< 500 MAD";
          case "medium":
            return "500-1500 MAD";
          case "high":
            return "> 1500 MAD";
          default:
            return "All Prices";
        }
      },
      options: [
        { label: "All Prices", value: "" },
        { label: "< 500 MAD", value: "low" },
        { label: "500-1500 MAD", value: "medium" },
        { label: "> 1500 MAD", value: "high" },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Packs</h1>
        <p className="text-gray-600 mt-2">
          Complete list of tours ({totalFiltered} total)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={paginatedPacks}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search packs by title, destination, price..."
        loading={loading}
        currentPage={clientPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        currentSort={{ field: sortField, order: sortOrder }}
        filters={filters}
        onView={handleView}
        onDelete={(id) => {
          const pack = packs.find((p) => p._id === id);
          if (pack) openDeleteDialog(pack);
        }}
        deleteLoading={deleteLoading}
        showActions={true}
        emptyMessage="No packs found"
      />

      {showDetailsModal && currentPack && (
        <PackDetailsModal
          pack={currentPack}
          loading={false}
          onClose={() => {
            setShowDetailsModal(false);
            setCurrentPack(null);
          }}
          onDelete={(pack) => {
            setShowDetailsModal(false);
            openDeleteDialog(pack);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, pack: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Pack"
        message={`Are you sure you want to delete "${deleteDialog.pack?.title || ""}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default PacksAdmin;
