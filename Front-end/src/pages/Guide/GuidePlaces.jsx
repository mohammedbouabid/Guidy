import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CardGuidePlace from "../../Components/GuidePlace/CardGuidePlace";
import { fetchGuidePlacesForGuide } from "../../store/slices/guidePlaceSlice";
import { Loader2 } from "lucide-react";

export default function GuidePlaces() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { placesForGuide, loading, error } = useSelector((state) => state.guidePlace);

  useEffect(() => {
    dispatch(fetchGuidePlacesForGuide());
  }, [dispatch]);

  // Refresh the list when navigating back from add form
  useEffect(() => {
    if (location.state?.refresh) {
      dispatch(fetchGuidePlacesForGuide());
    }
  }, [location, dispatch]);


 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Guide Places</h1>
          <button
            onClick={() => navigate('/guide/places/add')}
            className="bg-primary cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#d55a26] transition-colors"
          >
            Add New Place
          </button>
        </div>

        {Array.isArray(placesForGuide) && placesForGuide.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placesForGuide.map((place) => (
              <CardGuidePlace key={place._id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No places found. Create your first place!</p>
          </div>
        )}
      </div>
    </div>
  );
}
