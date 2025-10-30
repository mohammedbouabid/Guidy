import React, { useMemo, useState } from "react";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { TourTypeSelect } from "../../components/TourTypeSelect";

/** A11y-friendly 5-star picker
 * value: "", "1".."5"
 * defaultWhenEmpty: number used ONLY for visual when value === "" (e.g., 0 for min, 5 for max)
 */
function StarRating({ label, value, onChange, defaultWhenEmpty = 0, className = "" }) {
  const highlighted = value === "" ? defaultWhenEmpty : Number(value);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-700 min-w-16">{label}</span>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          const n = i + 1;
          const active = n <= highlighted;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(String(n))}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  onChange(String(Math.min(5, (value === "" ? defaultWhenEmpty : Number(value)) + 1)));
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  onChange(String(Math.max(1, (value === "" ? defaultWhenEmpty : Number(value)) - 1)));
                }
              }}
              aria-label={`${label}: ${n} star${n > 1 ? "s" : ""}`}
              className={`p-1 transition-transform hover:scale-110 focus:outline-none`}
            >
              {/* Star icon (SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-6 h-6 ${active ? "text-yellow-400" : "text-gray-300"}`}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Clear button */}
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

export default function FilterSearchBar({
  className = "",
  buttonText = "Search",
  initialDestination = "",
  initialDateRange = null,
  initialTourType = null,
  onSearch = () => {},
}) {
  const [destination, setDestination] = useState(initialDestination);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [tourType, setTourType] = useState(initialTourType);

  // local-only fields
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // Ratings are strings to match other inputs; "" means unset
  const [minRating, setMinRating] = useState(""); // default visual = 0 stars
  const [maxRating, setMaxRating] = useState(""); // default visual = 5 stars

  const errors = useMemo(() => {
    const e = {};
    const mp = minPrice === "" ? null : Number(minPrice);
    const xp = maxPrice === "" ? null : Number(maxPrice);

    // For validation we treat empty as null; actual defaults (0/5) applied on submit
    const mr = minRating === "" ? null : Number(minRating);
    const xr = maxRating === "" ? null : Number(maxRating);

    if (mp != null && mp < 0) e.minPrice = "Min price ≥ 0";
    if (xp != null && xp < 0) e.maxPrice = "Max price ≥ 0";
    if (mp != null && xp != null && mp > xp) e.priceRange = "Min price must be ≤ max price";

    if (mr != null && (mr < 0 || mr > 5)) e.minRating = "Min rating 0–5";
    if (xr != null && (xr < 0 || xr > 5)) e.maxRating = "Max rating 0–5";
    if (mr != null && xr != null && mr > xr) e.ratingRange = "Min rating must be ≤ max rating";

    return e;
  }, [minPrice, maxPrice, minRating, maxRating]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasErrors) return;

    // Apply defaults for ratings when unset: min=0, max=5
    const outMinRating = minRating === "" ? 0 : Number(minRating);
    const outMaxRating = maxRating === "" ? 5 : Number(maxRating);

    onSearch({
      destination,
      dateRange,
      tourType,
      minPrice: minPrice === "" ? null : Number(minPrice),
      maxPrice: maxPrice === "" ? null : Number(maxPrice),
      minRating: outMinRating,
      maxRating: outMaxRating,
    });
  };

  const handleReset = () => {
    setDestination("");
    setDateRange(null);
    setTourType(null);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(""); // visually 0
    setMaxRating(""); // visually 5
  };

  return (
    <form onSubmit={handleSubmit} className={`relative z-20 w-full max-w-5xl px-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Destination */}
        <input
          type="text"
          placeholder="Search destinations"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="lg:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
          aria-label="Destination"
        />

        {/* Date range */}
        <div className="lg:col-span-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {/* Tour type */}
        <div className="lg:col-span-2">
          <TourTypeSelect value={tourType} onChange={setTourType} />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-2 lg:col-span-2">
          <input
            inputMode="numeric"
            type="number"
            min="0"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            aria-label="Minimum price"
          />
          <input
            inputMode="numeric"
            type="number"
            min="0"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            aria-label="Maximum price"
          />
        </div>

        {/* Rating (STAR PICKERS) */}
        <div className="lg:col-span-2">
          <StarRating
            label="Min rating"
            value={minRating}
            onChange={setMinRating}
            defaultWhenEmpty={0} // visually 0 stars if unset
          />
        </div>
        <div className="lg:col-span-2">
          <StarRating
            label="Max rating"
            value={maxRating}
            onChange={setMaxRating}
            defaultWhenEmpty={5} // visually 5 stars if unset
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:col-span-2">
          <button
            type="submit"
            disabled={hasErrors}
            className={`bg-[#eb662b] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              hasErrors ? "opacity-60 cursor-not-allowed" : "hover:bg-[#d9551f]"
            }`}
          >
            {buttonText}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        {/* Inline errors */}
        {hasErrors && (
          <div className="md:col-span-2 lg:col-span-6 text-sm text-red-600">
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
