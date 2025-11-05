import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, MessageSquare, Loader2, LogIn } from "lucide-react";
import api from "@/api/axios";
import { fetchUserBookings } from "@/store/slices/bookingSlice";

export default function ReviewSection({ pack }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.Auth?.user);
  const bookingsState = useSelector((state) => state.booking);

  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState(null);

  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const endDate = useMemo(() => (pack?.endDate ? new Date(pack.endDate) : null), [pack]);
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    const loadRatings = async () => {
      if (!pack?._id) return;
      setRatingsLoading(true);
      setRatingsError(null);
      try {
        const res = await api.get(`/rating/pack/${pack._id}`);
        // backend returns: { success, totalRatings, page, limit, ratings }
        setRatings(Array.isArray(res.data?.ratings) ? res.data.ratings : []);
      } catch (err) {
        // Gracefully handle 404 (no rating yet) and 401 (not logged in)
        const status = err.response?.status;
        if (status === 404) {
          setRatings([]);
        } else if (status === 401) {
          setRatingsError("Please log in to view reviews.");
        } else {
          setRatingsError(err.response?.data?.message || "Unable to load ratings");
        }
      } finally {
        setRatingsLoading(false);
      }
    };
    loadRatings();
  }, [pack?._id]);

  useEffect(() => {
    // Preload current user's bookings to determine eligibility
    if (authUser) {
      dispatch(fetchUserBookings({ page: 1, limit: 50 }));
    }
  }, [dispatch, authUser]);

  const userHasEligibleBooking = useMemo(() => {
    if (!authUser) return false;
    const items = bookingsState?.items || [];
    return items.some((b) => {
      const packId = b?.packID?._id || b?.packID;
      return (
        String(packId) === String(pack?._id) &&
        b?.isCancelled === false &&
        b?.isCompleted === true
      );
    });
  }, [authUser, bookingsState?.items, pack?._id]);

  const userAlreadyRated = useMemo(() => {
    if (!authUser) return false;
    return ratings.some((r) => String(r?.clientID?._id || r?.clientID) === String(authUser?._id));
  }, [ratings, authUser]);

  const ratingOpen = useMemo(() => {
    if (!endDate) return false;
    return now >= endDate; // Only allow after the trip end date
  }, [now, endDate]);

  const canRate = authUser && ratingOpen && userHasEligibleBooking && !userAlreadyRated;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canRate) return;
    if (stars < 1) {
      setSubmitError("Please select a star rating");
      return;
    }
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await api.post("/rating", { stars, comment, packID: pack._id });
      setSubmitSuccess("Thanks! Your review has been submitted.");
      setComment("");
      setStars(0);
      // refresh ratings
      const res = await api.get(`/rating/pack/${pack._id}`);
      setRatings(Array.isArray(res.data?.ratings) ? res.data.ratings : []);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStar = (index) => {
    const filled = (hoverStars || stars) >= index;
    return (
      <button
        key={index}
        type="button"
        onMouseEnter={() => canRate && setHoverStars(index)}
        onMouseLeave={() => canRate && setHoverStars(0)}
        onClick={() => canRate && setStars(index)}
        className={`p-1 transition ${canRate ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        aria-label={`${index} star`}
      >
        <Star
          className={`${filled ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          size={24}
        />
      </button>
    );
  };

  return (
    <section className="mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          {pack?.avgRating !== undefined && (
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={18} />
              <span className="font-medium text-gray-800">{pack.avgRating} / 5</span>
            </div>
          )}
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {ratingsLoading ? (
            <div className="flex items-center text-gray-600"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading reviews...</div>
          ) : ratingsError ? (
            <div className="text-sm text-red-600">{ratingsError}</div>
          ) : ratings.length === 0 ? (
            <p className="text-sm text-gray-600">No reviews yet for this pack.</p>
          ) : (
            ratings.map((r) => (
              <div key={`${r._id}`} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`${i <= (r.stars || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} size={16} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 text-sm text-gray-800">
                  {r.comment ? r.comment : <span className="italic text-gray-500">No comment</span>}
                </div>
                <div className="mt-2 text-xs text-gray-500">by {r.clientID?.name || "Client"}</div>
              </div>
            ))
          )}
        </div>

        {/* Add Review */}
        <div className="mt-6 border-t pt-6">
          {!authUser ? (
            <div className="flex items-center gap-2 text-gray-700">
              <LogIn className="w-4 h-4" />
              <span>Please log in to view and rate reviews.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your rating</label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => renderStar(i))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05073c]/20"
                    placeholder="Share your experience..."
                    disabled={!canRate || submitLoading}
                  />
                </div>
              </div>

              {!ratingOpen && (
                <div className="text-sm text-gray-600">Ratings open after the trip ends on {endDate?.toLocaleDateString()}.</div>
              )}
              {ratingOpen && !userHasEligibleBooking && (
                <div className="text-sm text-gray-600">Only clients who booked and completed this trip can rate.</div>
              )}
              {userAlreadyRated && (
                <div className="text-sm text-gray-600">You have already rated this pack.</div>
              )}
              <div className="text-xs text-gray-500">Eligibility: You can rate only if you booked and completed this trip. Ratings open after the trip end date. One review per client.</div>
              {submitError && <div className="text-sm text-red-600">{submitError}</div>}
              {submitSuccess && <div className="text-sm text-green-600">{submitSuccess}</div>}

              <button
                type="submit"
                className="px-4 py-2 bg-[#05073c] text-white rounded-lg hover:bg-[#0a0d57] disabled:bg-gray-300 disabled:text-gray-600"
                disabled={!canRate || submitLoading}
              >
                {submitLoading ? (
                  <span className="flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}