"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/adminTable/data-table";
import { fetchUsers, deleteUser, getUserById, clearSelectedUser } from "@/store/slices/usersSlice";
import UserDetailsModal from "@/components/adminHelpers/UserDetailsModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Calendar, UserCheck } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toastNotifications.jsx";

const initialConfirmState = {
  isOpen: false,
  userId: null,
  userName: "",
  source: "table",
};

export default function UserManagement({ role = "guide", title = "Users", columnConfig = [] }) {
  const dispatch = useDispatch();
  const { users, count, page, limit, loading, deleteLoading, deleteError, selectedUser, userLoading } =
    useSelector((state) => state.users);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState({ field: "createdAt", order: "desc" });
  const [dateFilter, setDateFilter] = useState("");
  const [profileCompletionFilter, setProfileCompletionFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(initialConfirmState);

  // Calculate total pages
  const totalPages = Math.ceil(count / limit);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users when dependencies change
  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit,
        search: debouncedSearch,
        sort: sorting.field,
        order: sorting.order,
        dateFilter,
        profileCompletionFilter,
        role,
      })
    );
  }, [
    dispatch,
    currentPage,
    limit,
    debouncedSearch,
    sorting,
    dateFilter,
    profileCompletionFilter,
    role,
  ]);

  // Handle delete error
  useEffect(() => {
    if (deleteError) {
      showErrorToast(deleteError);
    }
  }, [deleteError]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (field, order) => {
    setSorting({ field, order });
    setCurrentPage(1);
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  const handleProfileCompletionFilterChange = (filter) => {
    setProfileCompletionFilter(filter);
    setCurrentPage(1);
  };

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case "today":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      default:
        return "All Time";
    }
  };

  const getProfileCompletionFilterLabel = () => {
    switch (profileCompletionFilter) {
      case "complete":
        return "Complete Profile";
      case "incomplete":
        return "Incomplete Profile";
      default:
        return "All Profiles";
    }
  };

  // Handle view user details
  const handleView = async (userId) => {
    setShowModal(true);
    await dispatch(getUserById(userId));
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedUser());
  };

  const userTypeLabel = role === "guide" ? "guide" : role === "client" ? "client" : "user";

  const openConfirmDialog = (userId, source = "table") => {
    const user = users.find((u) => u._id === userId);
    setConfirmDialog({
      isOpen: true,
      userId,
      userName: user?.name || "",
      source,
    });
  };

  const closeConfirmDialog = () => setConfirmDialog(initialConfirmState);

  const handleDeleteFromModal = (userId) => {
    openConfirmDialog(userId, "modal");
  };

  const handleDelete = (userId) => {
    openConfirmDialog(userId, "table");
  };

  const handleConfirmDelete = async () => {
    const { userId, source } = confirmDialog;
    if (!userId) return;

    try {
      await dispatch(deleteUser(userId)).unwrap();
      const label = userTypeLabel.charAt(0).toUpperCase() + userTypeLabel.slice(1);
      showSuccessToast(`${label} deleted successfully.`);
      if (source === "modal") {
        handleCloseModal();
      }
    } catch (error) {
      showErrorToast(error?.message || `Failed to delete the ${userTypeLabel}.`);
    }
  };

  // Default columns configuration
  const defaultColumns = [
    {
      accessorKey: "name",
      id: "profile",
      header: "Profile",
      sortField: "name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
              <img
                src={
                  user.profileImage ||
                  "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"
                }
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-[var(--accent)]"
              />
            <span className="truncate text-sm sm:text-base max-w-[100px] sm:max-w-[100px]">
              {user.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const value = row.getValue("email");
        return value ? (
          <input
            readOnly
            value={value}
            className="w-full bg-transparent border-none outline-none text-sm text-gray-800 truncate cursor-text"
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
            Not defined
          </span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const value = row.getValue("phone");
        return value ? (
          <input
            readOnly
            value={value}
            className="w-full bg-transparent border-none outline-none text-sm text-gray-800 truncate cursor-text"
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
            Not defined
          </span>
        );
      },
    },
    {
      accessorKey: "cin",
      header: "CIN",
      cell: ({ row }) => {
        const value = row.getValue("cin");
        return value ? (
          <input
            readOnly
            value={value}
            className="w-full bg-transparent border-none outline-none text-sm text-gray-800 truncate cursor-text"
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
            Not defined
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined On",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
  ];

  // Use custom columns if provided, otherwise use default
  const columns = columnConfig.length > 0 ? columnConfig : defaultColumns;

  // Filter configuration
  const filters = [
    {
      icon: Calendar,
      label: "Filter by Date",
      mobileLabel: "Date",
      value: dateFilter,
      onChange: handleDateFilterChange,
      getLabel: getDateFilterLabel,
      options: [
        { value: "", label: "All Time" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "year", label: "This Year" },
      ],
    },
    {
      icon: UserCheck,
      label: "Profile Completion",
      mobileLabel: "Profile",
      value: profileCompletionFilter,
      onChange: handleProfileCompletionFilterChange,
      getLabel: getProfileCompletionFilterLabel,
      options: [
        { value: "", label: "All Profiles" },
        { value: "complete", label: "Complete Profile" },
        { value: "incomplete", label: "Incomplete Profile" },
      ],
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <DataTable
        columns={columns}
        data={users}
        searchValue={search}
        onSearchChange={setSearch}
        loading={loading}
        deleteLoading={deleteLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        currentSort={sorting}
        filters={filters}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        emptyMessage="No users found."
      />
      
      {showModal && (
        <UserDetailsModal
          user={selectedUser}
          loading={userLoading}
          onClose={handleCloseModal}
          onDelete={handleDeleteFromModal}
          deleteLoading={deleteLoading}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmDelete}
        title={`Delete ${userTypeLabel === "guide" ? "Guide" : userTypeLabel === "client" ? "Client" : "User"}`}
        message={
          confirmDialog.userName
            ? `Are you sure you want to delete "${confirmDialog.userName}"? This action cannot be undone.`
            : `Are you sure you want to delete this ${userTypeLabel}? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
