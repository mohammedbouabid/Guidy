import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGuideBookings } from "@/store/slices/bookingSlice";

import BookingDetailsModal from "../../Components/Bookings/BookingDetailsModal";

const GuideBookings = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.booking);
  

  
  const [detailsModal, setDetailsModal] = useState({ 
    isOpen: false, 
    booking: null 
  });

  // Charger les bookings du guide au montage
  useEffect(() => {
    dispatch(fetchGuideBookings({}));
  }, [dispatch]);

  // Ouvrir leodal de détails
  const openDetailsModal = (booking) => {
    setDetailsModal({ isOpen: true, booking });
  };

  // Ouvrir le modal de confirmation d'annulation
 

  // Annuler un booking
 

  return (
    <div className="w-full bg-gradient-to-br to-gray-50 p-4 overflow-x-hidden">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Mes Réservations
          </h2>
          <div className="text-sm text-gray-600">
            {items?.length || 0} réservation(s)
          </div>
        </div>

        {loading && <p className="text-center py-4 text-gray-500">Chargement...</p>}
        {error && <p className="text-center py-4 text-red-500">{error}</p>}

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-3 py-3 text-left font-semibold">Utilisateur</th>
                <th className="px-3 py-3 text-left font-semibold">Pack</th>
                <th className="px-3 py-3 text-left font-semibold">Prix</th>
                <th className="px-3 py-3 text-left font-semibold">Places</th>
                <th className="px-3 py-3 text-left font-semibold">Type</th>
                <th className="px-3 py-3 text-left font-semibold">Statut</th>
                <th className="px-3 py-3 text-left font-semibold">Date Réservation</th>
                <th className="px-3 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {items?.length > 0 ? (
                items.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`table-row-transition hover:bg-gray-50 ${booking.isCancelled ? 'table-row-cancelled' : ''}`}
                  >
                    {/* Utilisateur */}
                    <td className="px-3 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.userID?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.userID?.email || '-'}
                        </p>
                      </div>
                    </td>

                    {/* Pack */}
                    <td className="px-3 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.packID?.title || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.packID?.startLocation || '-'} → {booking.packID?.endLocation || '-'}
                        </p>
                      </div>
                    </td>

                    {/* Prix */}
                    <td className="px-3 py-4 text-gray-800 font-semibold">
                      {booking.packID?.price ? `${booking.packID.price}$` : '-'}
                    </td>

                    {/* Places réservées */}
                    <td className="px-3 py-4 text-center">
                      {booking.spotsBooked || 1}
                    </td>

                    {/* Type VIP */}
                    <td className="px-3 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.isVip
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {booking.isVip ? 'VIP' : 'Normal'}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="px-3 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.isCancelled
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {booking.isCancelled ? 'Annulé' : 'Actif'}
                      </span>
                    </td>

                    {/* Date de réservation */}
                    <td className="px-3 py-4 text-gray-600 text-xs">
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 transition cursor-pointer"
                          title="Voir détails"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      Aucune réservation trouvée pour vos packs.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Footer avec compteur */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
          <div className="text-sm text-gray-600">
            {items?.length || 0} réservation(s) trouvée(s)
          </div>
        </div>
      </div>

     

      {/* Modal de détails */}
      <BookingDetailsModal
        isOpen={detailsModal.isOpen}
        booking={detailsModal.booking}
        onClose={() => setDetailsModal({ isOpen: false, booking: null })}
      />
    </div>
  );
};

export default GuideBookings;
