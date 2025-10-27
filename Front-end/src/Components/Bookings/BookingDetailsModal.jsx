import React from 'react';
import { X, User, Mail, MapPin, Calendar, DollarSign, Users, Crown, CheckCircle, XCircle, Package } from 'lucide-react';

const BookingDetailsModal = ({ isOpen, booking, onClose }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90vw] max-h-[92vh] transform transition-all animate-scaleIn flex flex-col">
        {/* Header compact */}
        <div className="relative bg-gradient-to-r from-[#EB662B] via-[#f57c3f] to-[#EB662B] px-6 py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <h2 className="text-lg font-bold text-white">Détails de la Réservation</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 rounded-full transition-all hover:rotate-90 duration-300 cursor-pointer"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body avec design cards modernes */}
        <div className="p-5 bg-gray-50 flex-1 overflow-y-auto">
          {/* Status Bar compact */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {booking.isCancelled ? (
                <div className="flex items-center gap-1.5 text-red-600">
                  <XCircle size={16} strokeWidth={2.5} />
                  <span className="text-sm font-bold">Annulé</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle size={16} strokeWidth={2.5} />
                  <span className="text-sm font-bold">Confirmé</span>
                </div>
              )}
              
              {booking.isVip && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md">
                  <Crown size={14} />
                  <span className="font-bold text-xs">VIP</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Réservé le</p>
              <p className="text-sm font-bold text-gray-900">
                {booking.createdAt
                  ? new Date(booking.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Main Grid - 2 Columns avec cards blanches */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              {/* Client Card */}
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-[#EB662B]/10 rounded-lg">
                    <User size={16} className="text-[#EB662B]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Client</h3>
                </div>
                
                <div className="space-y-2.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Nom complet</p>
                    <p className="text-sm font-bold text-gray-900">
                      {booking.userID?.name || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="h-px bg-gray-200"></div>
                  
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Email</p>
                    <p className="text-xs text-gray-700">
                      {booking.userID?.email || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pack Card */}
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-[#EB662B]/10 rounded-lg">
                    <Package size={16} className="text-[#EB662B]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Pack</h3>
                </div>
                
                <div className="space-y-2.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Titre du pack</p>
                    <p className="text-sm font-bold text-gray-900">
                      {booking.packID?.title || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Départ</p>
                      <p className="text-xs font-semibold text-gray-900">
                        {booking.packID?.startLocation || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Arrivée</p>
                      <p className="text-xs font-semibold text-gray-900">
                        {booking.packID?.endLocation || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Date début</p>
                      <p className="text-xs text-gray-900">
                        {booking.packID?.startDate
                          ? new Date(booking.packID.startDate).toLocaleDateString('fr-FR')
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Date fin</p>
                      <p className="text-xs text-gray-900">
                        {booking.packID?.endDate
                          ? new Date(booking.packID.endDate).toLocaleDateString('fr-FR')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {/* Pricing Card */}
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-[#EB662B]/10 rounded-lg">
                    <DollarSign size={16} className="text-[#EB662B]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Tarification</h3>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">Prix unitaire</span>
                    <span className="text-lg font-bold text-gray-900">
                      {booking.packID?.price || 0}$
                    </span>
                  </div>
                  
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">Places réservées</span>
                    <span className="text-lg font-bold text-gray-900">
                      {booking.spotsBooked || 1}
                    </span>
                  </div>
                  
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="bg-[#EB662B]/5 rounded-lg p-3 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#EB662B]">
                        {(booking.packID?.price || 0) * (booking.spotsBooked || 1)}$
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-[#EB662B]/10 rounded-lg">
                    <Calendar size={16} className="text-[#EB662B]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Informations</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-gray-600 text-xs">Type de réservation</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {booking.isVip ? 'VIP' : 'Standard'}
                    </span>
                  </div>
                  
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-gray-600 text-xs">Statut</span>
                    <span className={`font-bold text-sm ${booking.isCancelled ? 'text-red-600' : 'text-green-600'}`}>
                      {booking.isCancelled ? 'Annulé' : 'Confirmé'}
                    </span>
                  </div>
                  
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-gray-600 text-xs">Places totales</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {booking.spotsBooked || 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-[#EB662B] text-white rounded-xl hover:bg-[#d55a25] transition-all font-bold cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
