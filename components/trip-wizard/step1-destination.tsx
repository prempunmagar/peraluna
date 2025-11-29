'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Plane } from 'lucide-react';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { searchDestinations, type Destination } from '@/lib/data/destinations';

const POPULAR_DESTINATIONS = [
  { city: 'Paris', country: 'France' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'New York', country: 'United States' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Dubai', country: 'United Arab Emirates' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Rome', country: 'Italy' },
];

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
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 150); // Faster since it's local

  // Search destinations using local database
  const suggestions = useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.length < 1) {
      return [];
    }
    return searchDestinations(debouncedSearchQuery, 8);
  }, [debouncedSearchQuery]);

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

  const handleDestinationSelect = (dest: Destination | { city: string; country: string }) => {
    updateField('destination', dest.city);
    updateField('country', dest.country);
    setSearchQuery(dest.city);
    setShowSuggestions(false);
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

  // Keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleDestinationSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Reset selection when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="destination">Where do you want to go?</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            id="destination"
            type="text"
            placeholder="Search cities, countries, or regions..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="h-14 pl-11 text-base"
            autoComplete="off"
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && searchQuery.length >= 1 && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-[58px] z-[100] max-h-80 overflow-y-auto rounded-lg border border-gray-200 shadow-2xl"
              style={{ backgroundColor: '#ffffff' }}
            >
              {suggestions.map((place, index) => (
                <button
                  key={`${place.city}-${place.country}`}
                  onClick={() => handleDestinationSelect(place)}
                  className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 ${
                    index === selectedIndex
                      ? 'bg-purple-50'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: index === selectedIndex ? '#f5f3ff' : '#ffffff' }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Plane className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{place.city}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {place.country}
                      {place.region && ` • ${place.region}`}
                    </p>
                  </div>
                  {place.tags && place.tags.length > 0 && (
                    <div className="hidden sm:flex gap-1">
                      {place.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {showSuggestions && searchQuery.length >= 2 && suggestions.length === 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-[58px] z-[100] rounded-lg border border-gray-200 p-4 shadow-2xl"
              style={{ backgroundColor: '#ffffff' }}
            >
              <p className="text-center text-sm text-muted-foreground">
                No destinations found. Try a different search or select from popular destinations below.
              </p>
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
              onClick={() => handleDestinationSelect(dest)}
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
