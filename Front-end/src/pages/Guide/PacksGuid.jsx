"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Edit, Trash2, Eye, Plus, MapPin, DollarSign, Users, Calendar, CheckCircle, XCircle, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePack, fetchGuidePacks, fetchPackById } from "@/store/slices/packSlice";
import { DataTable } from "@/components/adminTable/data-table";
import PackDetailsModal from "@/components/Packs/PackDetailsModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "react-hot-toast";

const PacksGuid = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.pack);
  const [currentPack, setCurrentPack] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, packId: null, packTitle: '' });
  
  // Client-side filters and search
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  
  // Client-side pagination
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all packs once on mount
  useEffect(() => {
    dispatch(fetchGuidePacks({ page: 1, limit: 1000 }));
  }, [dispatch]);

  // Client-side filtering and sorting
  const filteredAndSortedPacks = useMemo(() => {
    let filtered = [...(items || [])];

    // Apply search filter (ALL fields)
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((pack) => {
        const title = pack.title?.toLowerCase() || "";
        const description = pack.description?.toLowerCase() || "";
        const startLocation = pack.startLocation?.toLowerCase() || "";
        const endLocation = pack.endLocation?.toLowerCase() || "";
        const price = pack.price?.toString() || "";
        const maxClients = pack.maxClients?.toString() || "";
        const categories = pack.categories?.join(" ").toLowerCase() || "";
        const startDate = pack.startDate
          ? new Date(pack.startDate).toLocaleDateString("en-GB").toLowerCase()
          : "";
        const endDate = pack.endDate
          ? new Date(pack.endDate).toLocaleDateString("en-GB").toLowerCase()
          : "";
        
        return (
          title.includes(searchLower) ||
          description.includes(searchLower) ||
          startLocation.includes(searchLower) ||
          endLocation.includes(searchLower) ||
          price.includes(searchLower) ||
          maxClients.includes(searchLower) ||
          categories.includes(searchLower) ||
          startDate.includes(searchLower) ||
          endDate.includes(searchLower)
        );
      });
    }

    // Apply availability filter
    if (availabilityFilter === "available") {
      filtered = filtered.filter((pack) => pack.availability === true);
    } else if (availabilityFilter === "unavailable") {
      filtered = filtered.filter((pack) => pack.availability === false);
    }

    // Apply price filter
    if (priceFilter === "low") {
      filtered = filtered.filter((pack) => pack.price < 500);
    } else if (priceFilter === "medium") {
      filtered = filtered.filter((pack) => pack.price >= 500 && pack.price <= 1500);
    } else if (priceFilter === "high") {
      filtered = filtered.filter((pack) => pack.price > 1500);
    }

    // Apply sorting
    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case "startDate":
            aValue = new Date(a.startDate);
            bValue = new Date(b.startDate);
            break;
          case "title":
            aValue = a.title || "";
            bValue = b.title || "";
            break;
          case "price":
            aValue = a.price || 0;
            bValue = b.price || 0;
            break;
          case "maxClients":
            aValue = a.maxClients || 0;
            bValue = b.maxClients || 0;
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
  }, [items, searchValue, availabilityFilter, priceFilter, sortField, sortOrder]);

  // Client-side pagination
  const totalFilteredDocs = filteredAndSortedPacks.length;
  const totalClientPages = Math.ceil(totalFilteredDocs / itemsPerPage);
  const paginatedPacks = useMemo(() => {
    const startIndex = (clientPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedPacks.slice(startIndex, endIndex);
  }, [filteredAndSortedPacks, clientPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setClientPage(1);
  }, [searchValue, availabilityFilter, priceFilter]);

  // Handlers
  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handlePageChange = (page) => {
    setClientPage(page);
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleView = async (id) => {
    const pack = items.find(p => p._id === id);
    if (pack) {
      setCurrentPack(pack);
      setShowDetailsModal(true);
    }
  };

  const handleEdit = (id) => {
    navigate(`/guide/packs/edit/${id}`);
  };

  const openDeleteDialog = (pack) => {
    setDeleteDialog({ isOpen: true, packId: pack._id, packTitle: pack.title });
  };

  const handleDelete = () => {
    dispatch(deletePack(deleteDialog.packId))
      .unwrap()
      .then(() => {
        toast.success('Pack deleted successfully');
        setDeleteDialog({ isOpen: false, packId: null, packTitle: '' });
      })
      .catch((err) => {
        toast.error(err?.message || 'Error deleting pack');
      });
  };

  // Columns definition
  const columns = [
    {
      accessorKey: "profileImg",
      header: "Image",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
          <img
            src={row.original.profileImg || "https://via.placeholder.com/80"}
            alt={row.original.title}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="font-medium text-gray-900 truncate max-w-[200px]">
            {row.original.title || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-green-600">
            {row.original.price || 0} MAD
          </span>
        </div>
      ),
    },
    {
      accessorKey: "maxClients",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-700">
            {row.original.maxClients || 0}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "availability",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        if (row.original.availability) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3" />
              Available
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Unavailable
          </span>
        );
      },
    },
    {
      accessorKey: "startLocation",
      header: "Route",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs">
          <MapPin className="w-3 h-3 text-blue-600" />
          <span className="truncate max-w-[80px]">{row.original.startLocation || "N/A"}</span>
          <span>→</span>
          <MapPin className="w-3 h-3 text-red-600" />
          <span className="truncate max-w-[80px]">{row.original.endLocation || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.original.startDate ? new Date(row.original.startDate) : null;
        return date ? (
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
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
  ];

  // Filters definition
  const filters = [
    {
      label: "Availability",
      mobileLabel: "Status",
      icon: CheckCircle,
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
        switch(priceFilter) {
          case "low": return "< 500 MAD";
          case "medium": return "500-1500 MAD";
          case "high": return "> 1500 MAD";
          default: return "All Prices";
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Packs</h1>
          <p className="text-gray-600 mt-2">
            Manage your tour packages ({totalFilteredDocs} total)
          </p>
        </div>
        <button
          onClick={() => navigate("/guide/packs/add")}
          className="flex items-center gap-2 bg-[#EB662B] text-white px-6 py-3 rounded-lg hover:bg-[#d55a25] transition cursor-pointer font-semibold shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Pack
        </button>
      </div>

      <DataTable
        columns={columns}
        data={paginatedPacks}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by title, location, price, dates..."
        loading={loading}
        deleteLoading={{}}
        currentPage={clientPage}
        totalPages={totalClientPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        currentSort={{ field: sortField, order: sortOrder }}
        filters={filters}
        onView={handleView}
        onDelete={(id) => {
          const pack = items.find(p => p._id === id);
          if (pack) openDeleteDialog(pack);
        }}
        emptyMessage="No packs found"
        showActions={true}
      />

      {/* Pack Details Modal */}
      {showDetailsModal && (
        <PackDetailsModal
          pack={currentPack}
          loading={false}
          onClose={() => {
            setShowDetailsModal(false);
            setCurrentPack(null);
          }}
          onEdit={handleEdit}
          onDelete={(pack) => {
            setShowDetailsModal(false);
            openDeleteDialog(pack);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, packId: null, packTitle: '' })}
        onConfirm={handleDelete}
        title="Delete Pack"
        message={`Are you sure you want to delete "${deleteDialog.packTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default PacksGuid;
