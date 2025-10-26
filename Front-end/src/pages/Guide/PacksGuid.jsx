import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePack, fetchGuidePacks } from "@/store/slices/packSlice";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "react-hot-toast";


const PacksGuid = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading, error, page, totalPages, limit } = useSelector((state) => state.pack);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, packId: null, packTitle: '' });

  // 🔄 Charger les packs du guide au montage du composant
  useEffect(() => {
    dispatch(fetchGuidePacks({ page: currentPage, limit: limit || 10 }));
  }, [dispatch, currentPage, limit]);

  // 🗑️ Ouvrir le modal de confirmation de suppression
  const openDeleteDialog = (pack) => {
    setDeleteDialog({ isOpen: true, packId: pack._id, packTitle: pack.title });
  };

  // 🗑️ Supprimer un pack après confirmation
  const handleDelete = () => {
    dispatch(deletePack(deleteDialog.packId))
      .unwrap()
      .then(() => {
        toast.success('Pack supprimé avec succès');
      })
      .catch((err) => {
        toast.error(err?.message || 'Erreur lors de la suppression');
      });
  };

  return (
    <div className="w-full bg-gradient-to-br to-gray-50 p-4 overflow-x-hidden">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Liste des Packs
          </h2>
          <button
            onClick={() => navigate("/guide/packs/add")}
            className="bg-[#EB662B] text-white px-4 py-2 rounded-md hover:bg-[#d55a25] transition cursor-pointer"
          >
            + Ajouter un Pack
          </button>
        </div>

        {loading && <p className="text-center py-4 text-gray-500">Chargement...</p>}
        {error && <p className="text-center py-4 text-red-500">{error}</p>}

        <div className="w-full overflow-hidden">
          <table className="w-full text-sm text-gray-700 table-fixed">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="w-16 px-2 py-3 text-left font-semibold">Image</th>
                <th className="px-3 py-3 text-left font-semibold">Titre</th>
                <th className="w-20 px-2 py-3 text-left font-semibold">Prix</th>
                <th className="w-16 px-2 py-3 text-left font-semibold">Places</th>
                <th className="w-24 px-2 py-3 text-left font-semibold">Dispo.</th>
                <th className="px-3 py-3 text-left font-semibold">Départ</th>
                <th className="px-3 py-3 text-left font-semibold">Arrivée</th>
                <th className="w-32 px-2 py-3 text-left font-semibold">Dates</th>
                <th className="w-24 px-2 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {items?.length > 0 ? (
                items.map((pack) => (
                  <tr
                    key={pack._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-2 py-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#EB662B]">
                        <img
                          src={pack.profileImg || "https://via.placeholder.com/80"}
                          alt={pack.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-4 font-medium truncate" title={pack.title}>
                      {pack.title}
                    </td>
                    <td className="px-2 py-4 text-gray-800 font-semibold whitespace-nowrap">
                      {pack.price}$
                    </td>
                    <td className="px-2 py-4 text-center">{pack.maxClients}</td>
                    <td className="px-2 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${pack.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {pack.availability ? "✓" : "✗"}
                      </span>
                    </td>
                    <td className="px-3 py-4 truncate" title={pack.startLocation}>
                      {pack.startLocation}
                    </td>
                    <td className="px-3 py-4 truncate" title={pack.endLocation}>
                      {pack.endLocation}
                    </td>
                    <td className="px-2 py-4 text-gray-600 text-xs">
                      <div className="truncate">
                        {pack.startDate ? new Date(pack.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : "-"}
                        <br />
                        {pack.endDate ? new Date(pack.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : "-"}
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => navigate(`/guide/packs/details/${pack._id}`)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 transition cursor-pointer"
                          title="Voir détails"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => navigate(`/guide/packs/edit/${pack._id}`)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-orange-100 transition cursor-pointer"
                          title="Modifier"
                        >
                          <Edit size={16} className="text-green-600" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(pack)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 transition cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      Aucun pack trouvé.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gray-50 border-t">
          <div className="text-sm text-gray-600">
            {items?.length || 0} pack(s) affiché(s) — Page {page || currentPage} / {totalPages || 1}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={loading || (page || currentPage) <= 1}
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600">
              {page || currentPage} / {totalPages || 1}
            </span>
            <button
              className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              onClick={() => setCurrentPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))}
              disabled={loading || (totalPages ? (page || currentPage) >= totalPages : false)}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, packId: null, packTitle: '' })}
        onConfirm={handleDelete}
        title="Supprimer le pack"
        message={`Êtes-vous sûr de vouloir supprimer le pack "${deleteDialog.packTitle}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
};

export default PacksGuid;
