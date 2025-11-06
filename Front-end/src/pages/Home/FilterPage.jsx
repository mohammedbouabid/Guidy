import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { fetchFilteredPacks, fetchPacks } from "@/store/slices/packSlice";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { TourTypeSelect } from "@/components/TourTypeSelect";
import { Card, CardContent } from "@/components/ui/components/ui/card";
import { Button } from "@/components/ui/components/ui/button";
import { ClockIcon, MapPinIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import SortDropdown from "@/components/SortDropdown";
const DEFAULT_LIMIT = 8;

/**
 * Convert query param string dates to a date-range object understood by DateRangePicker
 */
const toDateRange = (from, to) => {
  if (!from && !to) return null;
  const parsedFrom = from ? parseISO(from) : undefined;
  const parsedTo = to ? parseISO(to) : undefined;
  if (parsedFrom && Number.isNaN(parsedFrom.getTime())) return null;
  if (parsedTo && Number.isNaN(parsedTo.getTime())) return null;
  return { from: parsedFrom, to: parsedTo };
};

const parseQueryParams = (search) => {
  const params = new URLSearchParams(search);
  const startLocation = params.get("startLocation") || "";
  const startDateFrom = params.get("startDateFrom") || "";
  const startDateTo = params.get("startDateTo") || "";
  const category = params.get("category") || "";
  const priceMin = params.get("priceMin") || "";
  const priceMax = params.get("priceMax") || "";
  const avgRatingMin = params.get("avgRatingMin") || "";
  const avgRatingMax = params.get("avgRatingMax") || "";
  const sort = params.get("sort") || "";
  const pageParam = Number(params.get("page") || 1);
  const limitParam = Number(params.get("limit") || DEFAULT_LIMIT);
  const page = Number.isNaN(pageParam) || pageParam <= 0 ? 1 : pageParam;
  const limit =
    Number.isNaN(limitParam) || limitParam <= 0 ? DEFAULT_LIMIT : Math.min(limitParam, 50);

  return {
    destination: startLocation,
    dateRange: toDateRange(startDateFrom, startDateTo),
    tourType: category || undefined,
    minPrice: priceMin,
    maxPrice: priceMax,
    minRating: avgRatingMin,
    maxRating: avgRatingMax,
    sort,
    page,
    limit,
  };
};

const buildApiPayload = (filters) => {
  const payload = {};
  if (filters.destination) payload.startLocation = filters.destination;
  if (filters.dateRange?.from) payload.startDateFrom = format(filters.dateRange.from, "yyyy-MM-dd");
  if (filters.dateRange?.to) payload.startDateTo = format(filters.dateRange.to, "yyyy-MM-dd");
  if (filters.tourType) payload.category = filters.tourType;
  if (filters.minPrice !== null && filters.minPrice !== "") {
    const value = Number(filters.minPrice);
    if (!Number.isNaN(value)) payload.priceMin = value;
  }
  if (filters.maxPrice !== null && filters.maxPrice !== "") {
    const value = Number(filters.maxPrice);
    if (!Number.isNaN(value)) payload.priceMax = value;
  }
  if (filters.minRating !== null && filters.minRating !== "") {
    const value = Number(filters.minRating);
    if (!Number.isNaN(value)) payload.avgRatingMin = value;
  }
  if (filters.maxRating !== null && filters.maxRating !== "") {
    const value = Number(filters.maxRating);
    if (!Number.isNaN(value)) payload.avgRatingMax = value;
  }
  if (filters.sort) payload.sort = filters.sort;
  if (filters.page) payload.page = filters.page;
  if (filters.limit) payload.limit = filters.limit;
  return payload;
};

const buildQueryString = (filters) => {
  const params = new URLSearchParams();
  if (filters.destination) params.set("startLocation", filters.destination);
  if (filters.dateRange?.from) params.set("startDateFrom", format(filters.dateRange.from, "yyyy-MM-dd"));
  if (filters.dateRange?.to) params.set("startDateTo", format(filters.dateRange.to, "yyyy-MM-dd"));
  if (filters.tourType) params.set("category", filters.tourType);
  if (filters.minPrice !== null && filters.minPrice !== "") {
    params.set("priceMin", String(filters.minPrice));
  }
  if (filters.maxPrice !== null && filters.maxPrice !== "") {
    params.set("priceMax", String(filters.maxPrice));
  }
  if (filters.minRating !== null && filters.minRating !== "") {
    params.set("avgRatingMin", String(filters.minRating));
  }
  if (filters.maxRating !== null && filters.maxRating !== "") {
    params.set("avgRatingMax", String(filters.maxRating));
  }
  if (filters.page) params.set("page", String(filters.page));
  if (filters.sort) params.set("sort", String(filters.sort));
  if (filters.limit && filters.limit !== DEFAULT_LIMIT) {
    params.set("limit", String(filters.limit));
  }

  return params.toString();
};

function StarRating({ label, value, onChange, defaultWhenEmpty = 0, className = "" }) {
  const highlighted = value === "" ? defaultWhenEmpty : Number(value);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-700 min-w-16">{label}</span>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          const n = i + 1;
          const active = n <= highlighted;
          const halfStep = n === Math.ceil(highlighted) && highlighted % 1 !== 0;
          const icon = halfStep ? faStarHalfAlt : solidStar;

          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(String(n))}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const current = value === "" ? defaultWhenEmpty : Number(value);
                  onChange(String(Math.min(5, current + 1)));
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const current = value === "" ? defaultWhenEmpty : Number(value);
                  onChange(String(Math.max(1, current - 1)));
                }
              }}
              aria-label={`${label}: ${n} star${n > 1 ? "s" : ""}`}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <FontAwesomeIcon
                icon={icon}
                className={`w-5 h-5 ${active ? "text-yellow-400" : "text-gray-300"}`}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange("")}
        className="ml-2 text-xs text-gray-600 underline hover:text-gray-800"
        aria-label={`Clear ${label.toLowerCase()}`}
        title="Clear"
      >
        Clear
      </button>
    </div>
  );
}

function FilterControls({
  className = "",
  buttonText = "Search",
  initialDestination = "",
  initialDateRange = null,
  initialTourType = undefined,
  initialMinPrice = "",
  initialMaxPrice = "",
  initialMinRating = "",
  initialMaxRating = "",
  initialSort = "",
  limitValue = DEFAULT_LIMIT,
  onSearch = () => {},
}) {
  const [destination, setDestination] = useState(initialDestination);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [tourType, setTourType] = useState(initialTourType);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [maxRating, setMaxRating] = useState(initialMaxRating);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    setDestination(initialDestination);
  }, [initialDestination]);

  useEffect(() => {
    setDateRange(initialDateRange);
  }, [initialDateRange]);

  useEffect(() => {
    setTourType(initialTourType);
  }, [initialTourType]);

  useEffect(() => {
    setMinPrice(initialMinPrice);
  }, [initialMinPrice]);

  useEffect(() => {
    setMaxPrice(initialMaxPrice);
  }, [initialMaxPrice]);

  useEffect(() => {
    setMinRating(initialMinRating);
  }, [initialMinRating]);

  useEffect(() => {
    setMaxRating(initialMaxRating);
  }, [initialMaxRating]);

  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);

  const errors = useMemo(() => {
    const result = {};
    const minPriceNumber = minPrice === "" ? null : Number(minPrice);
    const maxPriceNumber = maxPrice === "" ? null : Number(maxPrice);
    const minRatingNumber = minRating === "" ? null : Number(minRating);
    const maxRatingNumber = maxRating === "" ? null : Number(maxRating);

    if (minPriceNumber != null && minPriceNumber < 0) result.minPrice = "Min price must be at least 0";
    if (maxPriceNumber != null && maxPriceNumber < 0) result.maxPrice = "Max price must be at least 0";
    if (minPriceNumber != null && maxPriceNumber != null && minPriceNumber > maxPriceNumber) {
      result.priceRange = "Min price must be less than or equal to max price";
    }

    if (minRatingNumber != null && (minRatingNumber < 0 || minRatingNumber > 5)) {
      result.minRating = "Min rating must be between 0 and 5";
    }
    if (maxRatingNumber != null && (maxRatingNumber < 0 || maxRatingNumber > 5)) {
      result.maxRating = "Max rating must be between 0 and 5";
    }
    if (minRatingNumber != null && maxRatingNumber != null && minRatingNumber > maxRatingNumber) {
      result.ratingRange = "Min rating must be less than or equal to max rating";
    }

    return result;
  }, [minPrice, maxPrice, minRating, maxRating]);

  const hasErrors = Object.keys(errors).length > 0;

  const buildSearchValues = (overrides = {}) => ({
    destination: destination?.trim() || "",
    dateRange,
    tourType,
    minPrice: minPrice === "" ? null : Number(minPrice),
    maxPrice: maxPrice === "" ? null : Number(maxPrice),
    minRating: minRating === "" ? null : Number(minRating),
    maxRating: maxRating === "" ? null : Number(maxRating),
    sort,
    limit: limitValue,
    ...overrides,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (hasErrors) return;

    onSearch(buildSearchValues({ page: 1 }));
  };

  const handleReset = () => {
    setDestination("");
    setDateRange(null);
    setTourType(undefined);
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setMaxRating("");
    setSort("");
    onSearch({
      destination: "",
      dateRange: null,
      tourType: undefined,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxRating: null,
      sort: "",
      limit: limitValue,
      page: 1,
    });
  };

  const handleSortChange = (value) => {
    setSort(value);
    if (hasErrors) return;
    onSearch(buildSearchValues({ sort: value, page: 1 }));
  };

  return (
 <form
  onSubmit={handleSubmit}
  className={`relative z-20 w-full px-2 sm:px-3 lg:px-4 ${className}`}
>
  <div className="bg-white/95 rounded-lg shadow-md px-3 sm:px-4 py-5 grid grid-cols-1 gap-3 lg:grid-cols-12 w-full">
    {/* Destination */}
    <div className="flex flex-col gap-1 lg:col-span-4">
      <label className="text-xs font-medium text-gray-600">Start location</label>
      <input
        type="text"
        placeholder="Search Start location"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="border border-gray-300 rounded-md px-2.5 py-1.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
        aria-label="Destination"
      />
    </div>

    {/* Date Range */}
    <div className="flex flex-col gap-1 lg:col-span-4">
      <label className="text-xs font-medium text-gray-600">Date range</label>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
    </div>

    {/* Tour Type */}
    <div className="flex flex-col gap-1 lg:col-span-4">
      <label className="text-xs font-medium text-gray-600">Tour type</label>
      <TourTypeSelect value={tourType} onChange={setTourType} className="w-full" />
    </div>

    {/* Filters row */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:col-span-12">
      <div className="flex flex-wrap items-center gap-3 lg:gap-5 w-full">
        <SortDropdown sort={sort} handleSortChange={handleSortChange} />


        {/* Price Inputs */}
        <div className="flex gap-2 sm:gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Min price</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Max price</label>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-3">
          <StarRating
            label="Min rating"
            value={minRating}
            onChange={setMinRating}
            defaultWhenEmpty={0}
          />
          <StarRating
            label="Max rating"
            value={maxRating}
            onChange={setMaxRating}
            defaultWhenEmpty={5}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          type="submit"
          disabled={hasErrors}
          className={`bg-[#eb662b] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            hasErrors ? "opacity-60 cursor-not-allowed" : "hover:bg-[#d9551f]"
          }`}
        >
          {buttonText}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>

    {/* Error Messages */}
    {hasErrors && (
      <div className="lg:col-span-12 text-sm text-red-600 space-y-0.5">
        {errors.minPrice && <div>• {errors.minPrice}</div>}
        {errors.maxPrice && <div>• {errors.maxPrice}</div>}
        {errors.priceRange && <div>• {errors.priceRange}</div>}
        {errors.minRating && <div>• {errors.minRating}</div>}
        {errors.maxRating && <div>• {errors.maxRating}</div>}
        {errors.ratingRange && <div>• {errors.ratingRange}</div>}
      </div>
    )}
  </div>
</form>

  );
}

const RatingDisplay = ({ value }) => {
  const rating = typeof value === "number" ? value : Number(value ?? 0);
  if (Number.isNaN(rating)) return <span className="text-xs text-[#05073c]">No ratings</span>;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const fullStars = Math.floor(rating);
          const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
          const isFull = index < fullStars;
          const isHalf = index === fullStars && hasHalf;

          const icon = isFull ? solidStar : isHalf ? faStarHalfAlt : solidStar;
          const color = isFull || isHalf ? "#e2ad64" : "#d1d5db";

          return <FontAwesomeIcon key={index} icon={icon} style={{ color }} className="w-4 h-4" />;
        })}
      </div>
      <span className="text-xs text-[#05073c]">{rating.toFixed(1)}</span>
    </div>
  );
};

const FilterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    items: packs,
    loading,
    error,
    page: currentPage,
    totalPages,
    totalDocs,
    limit: storeLimit,
  } = useSelector((state) => state.pack);

  const initialFilters = useMemo(() => parseQueryParams(location.search), [location.search]);
  const packList = Array.isArray(packs) ? packs : [];
  const activePage = currentPage || initialFilters.page || 1;
  const activeLimit = initialFilters.limit || storeLimit || DEFAULT_LIMIT;
  const hasFilterParams = useMemo(() => {
    const { destination, tourType, minPrice, maxPrice, minRating, maxRating, dateRange } =
      initialFilters;
    const hasLocation = Boolean(destination && destination.trim().length);
    const hasTourType = Boolean(tourType);
    const hasPrice = Boolean(
      (minPrice !== null && minPrice !== undefined && minPrice !== "") ||
        (maxPrice !== null && maxPrice !== undefined && maxPrice !== "")
    );
    const hasRating = Boolean(
      (minRating !== null && minRating !== undefined && minRating !== "") ||
        (maxRating !== null && maxRating !== undefined && maxRating !== "")
    );
    const hasDates = Boolean(dateRange?.from || dateRange?.to);
    return hasLocation || hasTourType || hasPrice || hasRating || hasDates;
  }, [initialFilters]);
  const paginationNumbers = useMemo(() => {
    if (!totalPages || totalPages <= 1) return [];
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }, [totalPages]);
  const startIndex =
    totalDocs && packList.length ? (activePage - 1) * activeLimit + 1 : 0;
  const endIndex =
    totalDocs && packList.length ? (activePage - 1) * activeLimit + packList.length : 0;

  useEffect(() => {
    const payload = buildApiPayload(initialFilters);
    if (hasFilterParams) {
      dispatch(fetchFilteredPacks(payload));
    } else {
      dispatch(
        fetchPacks({
          page: payload.page ?? 1,
          limit: payload.limit ?? DEFAULT_LIMIT,
          sort: payload.sort,
        })
      );
    }
  }, [dispatch, initialFilters, hasFilterParams]);

  const handleSearch = (values) => {
    const nextFilters = {
      destination: values.destination?.trim() || "",
      dateRange: values.dateRange,
      tourType: values.tourType,
      minPrice: values.minPrice,
      maxPrice: values.maxPrice,
      minRating: values.minRating,
      maxRating: values.maxRating,
      sort: values.sort || "",
      limit: values.limit ?? activeLimit,
      page: 1,
    };

    const query = buildQueryString(nextFilters);
    navigate(query ? `/filter?${query}` : "/filter", { replace: false });
  };

  const handlePackClick = (packId) => {
    navigate(`/packs/${packId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    if (!totalPages || newPage < 1 || newPage > totalPages || newPage === activePage) return;
    const query = buildQueryString({
      ...initialFilters,
      page: newPage,
      limit: activeLimit,
    });
    navigate(query ? `/filter?${query}` : "/filter", { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-16 sm:pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-screen-2xl mx-auto flex flex-col items-center gap-8">
        <div className="w-full flex justify-center">
          <FilterControls
            className="mx-auto"
            initialDestination={initialFilters.destination}
            initialDateRange={initialFilters.dateRange}
            initialTourType={initialFilters.tourType}
            initialMinPrice={initialFilters.minPrice}
            initialMaxPrice={initialFilters.maxPrice}
            initialMinRating={initialFilters.minRating}
            initialMaxRating={initialFilters.maxRating}
            initialSort={initialFilters.sort}
            limitValue={initialFilters.limit}
            onSearch={handleSearch}
          />
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#05073c] leading-tight">
              Filtered Tours
            </h2>
            <Button
              variant="ghost"
              className="text-sm sm:text-base text-[#05073c] hover:text-orange-500 hover:bg-transparent px-0 h-auto font-normal"
              onClick={() => navigate("/")}
            >
              Back to home
            </Button>
          </div>

          {totalDocs > 0 && (
            <p className="text-sm text-[#717171] mb-4">
              Showing {startIndex}-{endIndex} of {totalDocs} results
            </p>
          )}

          {loading && <p className="text-center py-10 text-[#05073c]">Loading tours...</p>}
          {error && (
            <p className="text-center text-red-500 py-10">
              {typeof error === "string" ? error : "Unable to load tours right now."}
            </p>
          )}

          {!loading && !error && (
            <>
              {packList.length === 0 ? (
                <p className="text-center py-10 text-[#05073c]">
                  No tours match your filters. Try adjusting your criteria.
                </p>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {packList.map((pack) => (
                      <Card
                        key={pack._id}
                        className="rounded-xl border border-[#e7e6e6] overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                        onClick={() => handlePackClick(pack._id)}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            <div
                              className="w-full h-[200px] bg-cover bg-center bg-no-repeat"
                              style={{ backgroundImage: `url(${pack.profileImg})` }}
                            />
                          </div>

                          <div className="p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPinIcon className="w-4 h-4 text-[#717171]" />
                              <span className="text-xs text-[#717171]">
                                {pack.startLocation || "Unknown"}
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-semibold text-[#05073c] leading-snug mb-2 truncate">
                              {pack.title}
                            </h3>

                            <p className="text-sm text-[#05073c] line-clamp-2 mb-3">
                              {pack.description}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-[#e7e6e6]">
                              <div className="flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-[#05073c]" />
                                <span className="text-xs text-[#05073c]">
                                  {typeof pack.durationTime === "number" && pack.durationTime > 0
                                    ? `${pack.durationTime} day${pack.durationTime > 1 ? "s" : ""}`
                                    : "N/A"}
                                </span>
                              </div>
                              <RatingDisplay value={pack.avgRating} />
                            </div>

                            <div className="flex items-baseline gap-1 mt-3">
                              <span className="text-xs text-[#05073c]">Price:</span>
                              <span className="text-sm font-medium text-[#05073c]">${pack.price}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {paginationNumbers.length > 0 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePageChange(activePage - 1)}
                        disabled={activePage === 1}
                        className={`px-3 py-1 rounded-md border border-[#d1d5db] text-sm transition-colors ${
                          activePage === 1
                            ? "cursor-not-allowed opacity-60"
                            : "hover:bg-[#eb662b] hover:text-white"
                        }`}
                      >
                        Previous
                      </button>

                      {paginationNumbers.map((pageNumber) => (
                        <button
                          type="button"
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-9 h-9 rounded-md border text-sm transition-colors ${
                            pageNumber === activePage
                              ? "bg-[#eb662b] text-white border-[#eb662b]"
                              : "border-[#d1d5db] text-[#05073c] hover:bg-[#eb662b]/10"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => handlePageChange(activePage + 1)}
                        disabled={activePage === totalPages}
                        className={`px-3 py-1 rounded-md border border-[#d1d5db] text-sm transition-colors ${
                          activePage === totalPages
                            ? "cursor-not-allowed opacity-60"
                            : "hover:bg-[#eb662b] hover:text-white"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FilterPage;
