import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CardPack from "../../Components/GuidePlace/CardPack";
import { fetchPacks } from "../../store/slices/packSlice";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "../../utils/errorUtils";

export default function GuidePlaces() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: packs, loading, error } = useSelector((state) => state.pack);

  useEffect(() => {
    dispatch(fetchPacks());
  }, [dispatch]);

  // Refresh the list when navigating back from add form
  useEffect(() => {
    if (location.state?.refresh) {
      dispatch(fetchPacks());
    }
  }, [location, dispatch]);


 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB662B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {getErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My Packs</h1>
          <button
            onClick={() => navigate('/guide/places/add')}
            className="bg-[#EB662B] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#d55a26] transition-colors"
          >
            Add New Pack
          </button>
        </div>

        {Array.isArray(packs) && packs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <CardPack key={pack._id} pack={pack} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No packs found. Create your first pack!</p>
          </div>
        )}
      </div>
    </div>
  );
}
