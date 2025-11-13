"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/components/ui/card";
import { Button } from "@/components/ui/components/ui/button";
import BookingDetailsModal from "@/components/Bookings/BookingDetailsModal";
import { fetchUserBookings, cancelBooking } from "@/store/slices/bookingSlice";
import { toast } from "sonner";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function ProfileBillingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: bookings = [], loading } = useSelector((state) => state.booking);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, booking: null });
  const [cancelDialog, setCancelDialog] = useState({ isOpen: false, booking: null });

  useEffect(() => {
    dispatch(fetchUserBookings({ limit: 200 }));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter]);

  const filteredBookings = useMemo(() => {
    let list = [...(bookings || [])];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((booking) =>
        (booking.packID?.title || "").toLowerCase().includes(term)
      );
    }

    if (typeFilter !== "all") {
      const isVip = typeFilter === "vip";
      list = list.filter((booking) => Boolean(booking.isVip) === isVip);
    }

    if (statusFilter !== "all") {
      const isCancelled = statusFilter === "cancelled";
      list = list.filter((booking) => Boolean(booking.isCancelled) === isCancelled);
    }

    return list;
  }, [bookings, searchTerm, typeFilter, statusFilter]);

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bVal - aVal; // latest first
    });
  }, [filteredBookings]);

  const totalPages = Math.max(1, Math.ceil(sortedBookings.length / itemsPerPage));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedBookings.slice(start, start + itemsPerPage);
  }, [sortedBookings, currentPage, itemsPerPage]);

  const openDetailsModal = (booking) =>
    setDetailsModal({ isOpen: true, booking });
  const closeDetailsModal = () =>
    setDetailsModal({ isOpen: false, booking: null });

  const openCancelDialog = (booking) =>
    setCancelDialog({ isOpen: true, booking });
  const closeCancelDialog = () =>
    setCancelDialog({ isOpen: false, booking: null });

  const handleCancelBooking = () => {
    if (!cancelDialog.booking?._id) return;
    dispatch(cancelBooking(cancelDialog.booking._id))
      .unwrap()
      .then(() => {
        toast.success("Booking cancelled successfully");
        dispatch(fetchUserBookings({ limit: 200 }));
      })
      .catch((err) => {
        toast.error(err?.message || "Error cancelling booking");
      })
      .finally(() => closeCancelDialog());
  };

  const totalSpent = useMemo(() => {
    return filteredBookings.reduce((sum, booking) => {
      const amount =
        (booking.packID?.price || 0) * (booking.spotsBooked || 1);
      return sum + amount;
    }, 0);
  }, [filteredBookings]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Bookings</h1>
          <p className="text-gray-600">
            Review every tour you booked and keep track of spending.
          </p>
        </div>
        <Button variant="outline" className="cursor-pointer" onClick={() => navigate("/profile")}>
          Back to Profile
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="pt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                A detailed list of every reservation linked to your account.
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Total Spent
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>

          <div className="w-full rounded-2xl b p-4 sm:p-5  shadow-sm border border-[#ffe2d6]">
  <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">

    {/* Trip Name */}
    <div className="flex-1 min-w-[220px]">
      <label className="block text-[11px] font-semibold text-[#9a9a9a] uppercase tracking-wide">
        Trip Name
      </label>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-1 w-full rounded-md border border-[#f3c8b7] bg-white px-3 py-2 text-sm text-[#05073c]
                   shadow-sm placeholder:text-[#b8b8b8]
                   focus:outline-none focus:ring-2 focus:ring-[#ffb89b] focus:border-[#eb662b]"
      />
    </div>

    {/* Type */}
    <div className="w-full sm:w-56">
      <label className="block text-[11px] font-semibold text-[#9a9a9a] uppercase tracking-wide">
        Type
      </label>
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="mt-1 w-full rounded-md border border-[#f3c8b7] bg-white px-3 py-2 text-sm text-[#05073c]
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffb89b] focus:border-[#eb662b] cursor-pointer"
      >
        <option value="all">All</option>
        <option value="vip">VIP</option>
        <option value="normal">Normal</option>
      </select>
    </div>

    {/* Status */}
    <div className="w-full sm:w-56">
      <label className="block text-[11px] font-semibold text-[#9a9a9a] uppercase tracking-wide">
        Status
      </label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mt-1 w-full rounded-md border border-[#f3c8b7] bg-white px-3 py-2 text-sm text-[#05073c]
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffb89b] focus:border-[#eb662b] cursor-pointer"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

  </div>
</div>

        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-3 py-2">Trip</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Booked On</th>
                  <th className="px-3 py-2">Spots</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-3 py-6 text-center text-gray-500">
                      Loading your bookings...
                    </td>
                  </tr>
                ) : paginatedBookings.length > 0 ? (
                  paginatedBookings.map((booking) => {
                    const total =
                      (booking.packID?.price || 0) * (booking.spotsBooked || 1);
                    return (
                      <tr
                        key={booking._id}
                        className={`border-b ${booking.isCancelled ? "opacity-60" : ""}`}
                      >
                        <td className="px-3 py-4">
                          <div className="font-semibold text-gray-900">
                            {booking.packID?.title || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.packID?.startLocation || "-"} →{" "}
                            {booking.packID?.endLocation || "-"}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.isVip
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {booking.isVip ? "VIP" : "Normal"}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.isCancelled
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {booking.isCancelled ? "Cancelled" : "Active"}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-gray-600 text-xs">
                          {formatDate(booking.createdAt)}
                        </td>
                        <td className="px-3 py-4 text-gray-900 font-semibold">
                          {booking.spotsBooked || 1}
                        </td>
                        <td className="px-3 py-4 text-gray-900 font-semibold">
                          {formatCurrency(total)}
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => openDetailsModal(booking)}
                            >
                              View
                            </Button>
                            {!booking.isCancelled && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => openCancelDialog(booking)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-3 py-6 text-center text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="py-6 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {detailsModal.isOpen && (
        <BookingDetailsModal
          isOpen={detailsModal.isOpen}
          booking={detailsModal.booking}
          onClose={closeDetailsModal}
        />
      )}

      {cancelDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[360px]">
            <h3 className="text-lg font-semibold mb-2">Cancel booking?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will mark the booking as cancelled.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeCancelDialog}>
                Close
              </Button>
              <Button variant="destructive" onClick={handleCancelBooking}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
