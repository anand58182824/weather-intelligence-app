import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, MapPin, X } from 'lucide-react';
import { GeocodingResult } from '../types/weather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onSelectResult?: (location: GeocodingResult) => void;
  isLoading: boolean;
  errorMessage: string | null;
  currentCity: string;
  searchResults: GeocodingResult[];
}

const POPULAR_CITIES = [
  'Chennai',
  'London',
  'Tokyo',
  'New York',
  'Paris',
  'Dubai',
  'Singapore',
  'Sydney',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSelectResult,
  isLoading,
  errorMessage,
  currentCity,
  searchResults,
}) => {
  const [query, setQuery] = useState('');
  const [localInputError, setLocalInputError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setLocalInputError('Please enter a city name.');
      return;
    }
    setLocalInputError(null);
    setShowDropdown(false);
    onSearch(trimmed);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (localInputError) {
      setLocalInputError(null);
    }
  };

  const handleClear = () => {
    setQuery('');
    setLocalInputError(null);
    setShowDropdown(false);
  };

  const handleQuickCity = (city: string) => {
    setQuery(city);
    setLocalInputError(null);
    setShowDropdown(false);
    onSearch(city);
  };

  const activeError = localInputError || errorMessage;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search any global city (e.g. Chennai, Paris, Tokyo)..."
            disabled={isLoading}
            className="w-full h-12 pl-12 pr-28 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
            aria-label="City search input"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="h-9 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
        </div>

        {/* Alternate Geocoding matches dropdown if multiple found */}
        {showDropdown && searchResults.length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-700/60">
              Matching locations (select to view forecast):
            </div>
            {searchResults.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  if (onSelectResult) onSelectResult(loc);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/70 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-medium text-white">{loc.name}</span>
                  {loc.admin1 && (
                    <span className="text-slate-400 text-xs">{loc.admin1},</span>
                  )}
                  <span className="text-slate-400 text-xs">{loc.country}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Clear Red Error State as required */}
      {activeError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{activeError}</div>
        </div>
      )}

      {/* Popular City Quick-Access Buttons */}
      <div className="flex items-center flex-wrap gap-1.5 pt-1">
        <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentCity.toLowerCase() === city.toLowerCase();
          return (
            <button
              key={city}
              type="button"
              onClick={() => handleQuickCity(city)}
              disabled={isLoading}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700/70 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
};
