import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackById } from '@/store/slices/packSlice';
import { 
  ArrowLeft, 
  Loader2,
  Edit,
  MapPin
} from 'lucide-react';
import { showErrorToast } from '@/utils/toastNotifications.jsx';

const PackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: pack, loading, error } = useSelector((state) => state.pack);

  useEffect(() => {
    dispatch(fetchPackById(id))
      .unwrap()
      .catch((err) => {
        showErrorToast(err?.message || 'Erreur lors du chargement du pack');
        navigate('/guide/PacksGuide');
      });
  }, [dispatch, id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB662B]" />
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Pack introuvable</p>
        <button
          onClick={() => navigate('/guide/PacksGuide')}
          className="px-4 py-2 bg-[#EB662B] text-white rounded-lg hover:bg-[#d55a25]"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/guide/PacksGuide')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour à la liste</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/guide/packs/edit/${pack._id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-80 bg-gradient-to-br from-[#EB662B] to-[#d55a25]">
            {pack.profileImg ? (
              <img
                src={pack.profileImg}
                alt={pack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-white text-2xl font-semibold">
                  {pack.title}
                </span>
              </div>
            )}
            {/* Availability Badge */}
            <div className="absolute top-4 right-4">
              {pack.availability ? (
                <div className="px-5 py-2.5 bg-green-500 text-white rounded-full shadow-lg font-semibold">
                  Disponible
                </div>
              ) : (
                <div className="px-5 py-2.5 bg-red-500 text-white rounded-full shadow-lg font-semibold">
                  Non disponible
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title & Price */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {pack.title}
                </h1>
                <div className="text-3xl font-bold text-[#EB662B]">
                  {pack.price} $
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {pack.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Dates */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
                <div>
                  <h3 className="font-bold text-blue-900 mb-3 text-lg">📅 Dates du voyage</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Début :</span>{' '}
                    {pack.startDate
                      ? new Date(pack.startDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '-'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fin :</span>{' '}
                    {pack.endDate
                      ? new Date(pack.endDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
              </div>

              {/* Locations */}
              <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
                <div>
                  <h3 className="font-bold text-green-900 mb-3 text-lg">📍 Itinéraire</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Départ :</span> {pack.startLocation}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Arrivée :</span> {pack.endLocation}
                  </p>
                </div>
              </div>

              {/* Capacity */}
              <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
                <div>
                  <h3 className="font-bold text-purple-900 mb-3 text-lg">👥 Capacité</h3>
                  <p className="text-sm text-gray-600">
                    Maximum <span className="font-bold text-lg">{pack.maxClients}</span> clients
                  </p>
                </div>
              </div>

              {/* Rating */}
              {pack.avgRating !== undefined && (
                <div className="p-5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-500">
                  <div>
                    <h3 className="font-bold text-yellow-900 mb-3 text-lg">⭐ Note moyenne</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-2xl text-yellow-600">{pack.avgRating}</span>
                      <span className="text-gray-500"> / 5</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Guide Places */}
            {pack.guidesPlacesId && pack.guidesPlacesId.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Lieux inclus dans ce pack ({pack.guidesPlacesId.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pack.guidesPlacesId.map((place, index) => (
                    <div
                      key={place._id || index}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-[#EB662B]"
                    >
                      {/* Image Gallery */}
                      {place.images && place.images.length > 0 ? (
                        <div className="relative h-48 bg-gray-100">
                          <img
                            src={place.images[0]}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                          {place.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                              +{place.images.length - 1} photos
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-[#EB662B] to-[#d55a25] flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-white opacity-50" />
                        </div>
                      )}

                      {/* Place Info */}
                      <div className="p-4">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">
                          {place.name || `Lieu ${index + 1}`}
                        </h4>
                        
                        {place.city && place.country && (
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 text-[#EB662B]" />
                            <span className="text-sm">
                              {place.city}, {place.country}
                            </span>
                          </div>
                        )}

                        {place.description && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {place.description}
                          </p>
                        )}

                        {/* Additional Images Preview */}
                        {place.images && place.images.length > 1 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {place.images.slice(1, 4).map((img, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                              >
                                <img
                                  src={img}
                                  alt={`${place.name} ${imgIndex + 2}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackDetails;
