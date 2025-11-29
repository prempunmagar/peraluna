'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Loader2, MapPin } from 'lucide-react';
import { useWizardStore } from '@/lib/stores/wizard-store';

const POPULAR_DESTINATIONS = [
  { city: 'Paris', country: 'France' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'New York', country: 'USA' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'London', country: 'UK' },
  { city: 'Rome', country: 'Italy' },
];

interface PlaceSuggestion {
  city: string;
  country: string;
  displayName: string;
}

// Nominatim API response type
interface NominatimResult {
  display_name: string;
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function Step1Destination() {
  const { destination, country, updateField } = useWizardStore();
  const [searchQuery, setSearchQuery] = useState(destination);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch places from OpenStreetMap Nominatim API
  const fetchPlaces = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1&featuretype=city`
      );
      const data = await response.json();

      const places: PlaceSuggestion[] = data
        .filter((item: NominatimResult) => item.address && (item.address.city || item.address.town || item.address.village || item.address.state || item.name))
        .map((item: NominatimResult) => {
          const addr = item.address!;
          const cityName = addr.city || addr.town || addr.village || addr.state || item.name;
          const countryName = addr.country || '';
          return {
            city: cityName,
            country: countryName,
            displayName: item.display_name,
          };
        })
        .filter((place: PlaceSuggestion, index: number, self: PlaceSuggestion[]) =>
          index === self.findIndex((p) => p.city === place.city && p.country === place.country)
        );

      setSuggestions(places);
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch places when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery && showSuggestions) {
      fetchPlaces(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, showSuggestions, fetchPlaces]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDestinationSelect = (city: string, countryName: string) => {
    updateField('destination', city);
    updateField('country', countryName);
    setSearchQuery(city);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Clear country when typing manually
    if (value !== destination) {
      updateField('destination', value);
      updateField('country', '');
    }
    setShowSuggestions(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="destination">Search Destination</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            id="destination"
            type="text"
            placeholder="e.g., Paris, Tokyo, Bali..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            className="h-14 pl-11 text-base"
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && searchQuery.length >= 2 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-[58px] z-[100] max-h-72 overflow-y-auto rounded-lg border border-border bg-white shadow-2xl dark:bg-gray-900"
              style={{ backgroundColor: 'white' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 bg-white px-4 py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Searching places...</span>
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((place, index) => (
                  <button
                    key={`${place.city}-${place.country}-${index}`}
                    onClick={() => handleDestinationSelect(place.city, place.country)}
                    className="flex w-full items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 last:border-b-0"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{place.city}</p>
                      <p className="truncate text-sm text-gray-500">{place.country}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="bg-white px-4 py-6 text-center text-sm text-gray-500">
                  No places found. Try a different search.
                </div>
              )}
            </div>
          )}
        </div>
        {destination && country && !showSuggestions && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{destination}, {country}</span>
          </p>
        )}
      </div>

      {/* Popular Destinations */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Popular Destinations
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={`${dest.city}-${dest.country}`}
              onClick={() => handleDestinationSelect(dest.city, dest.country)}
              className={`group flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 ${
                destination === dest.city && country === dest.country
                  ? 'border-primary bg-primary/10'
                  : 'border-border'
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {dest.city}
                </p>
                <p className="text-xs text-muted-foreground">{dest.country}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
