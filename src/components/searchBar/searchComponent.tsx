'use client';

import { useState } from "react";
import SearchFrom from "./searchFrom";
import SearchTo from "./searchTo";
import TripDatePicker from "./tripDatePicker";
import FlightOptionsCheckbox from "./flightOption";
import SearchButton from "./searchButton";
import FlightResults from "./FlightResults";

interface SearchState {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
}

interface FlightResults {
  success: boolean;
  outbound: {
    results: any[];
    total: number;
  };
  return?: {
    results: any[];
    total: number;
  };
  tripType: 'one-way' | 'roundtrip';
}

export default function SearchComponent() {
  const [searchState, setSearchState] = useState<SearchState>({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    isRoundTrip: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<FlightResults | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSearch = async () => {
    // Validate required fields
    if (!searchState.from) {
      setError('Please enter a departure city/airport');
      return;
    }
    if (!searchState.to) {
      setError('Please enter a destination city/airport');
      return;
    }
    if (!searchState.departureDate) {
      setError('Please select a departure date');
      return;
    }
    if (searchState.isRoundTrip && !searchState.returnDate) {
      setError('Please select a return date for round trip');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDebugInfo(null);

    const requestData = {
      origin: searchState.from,
      destination: searchState.to,
      date: searchState.departureDate,
      ...(searchState.isRoundTrip && searchState.returnDate
        ? { returnDate: searchState.returnDate }
        : {})
    };

    try {
      const apiUrl = `/api/flight-search`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Failed to parse API response');
      }
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      if (data && !data.success) {
        throw new Error(data.error || 'No flights found');
      }

      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8" data-testid="flight-search">
      <div className="rounded-lg shadow-lg p-6 transition-all duration-300" 
           style={{ backgroundColor: 'var(--form-bg)', borderColor: 'var(--border)' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Flight Search</h2>
          
          <FlightOptionsCheckbox
            isRoundTrip={searchState.isRoundTrip}
            onChange={(value) => setSearchState(prev => ({ ...prev, isRoundTrip: value }))}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>From</label>
              <SearchFrom
                value={searchState.from}
                onChange={(value) => setSearchState(prev => ({ ...prev, from: value }))}
                placeholder="Enter city or airport"
                showLabel={false}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>To</label>
              <SearchTo
                value={searchState.to}
                onChange={(value) => setSearchState(prev => ({ ...prev, to: value }))}
                placeholder="Enter city or airport"
                showLabel={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Departure Date</label>
              <input
                type="date"
                value={searchState.departureDate}
                onChange={(e) => setSearchState(prev => ({ ...prev, departureDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--form-input-bg)', 
                  color: 'var(--input-text)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px'
                }}
                placeholder="dd/mm/yyyy"
              />
            </div>

            {searchState.isRoundTrip && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Return Date</label>
                <input
                  type="date"
                  value={searchState.returnDate}
                  onChange={(e) => setSearchState(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--form-input-bg)', 
                    color: 'var(--input-text)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px'
                  }}
                  placeholder="dd/mm/yyyy"
                  min={searchState.departureDate}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: isLoading ? '#94a3b8' : 'var(--button-bg)',
              color: 'var(--button-text)'
            }}
          >
            {isLoading ? 'Searching...' : 'Search Flights'}
          </button>
        </form>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg transition-all duration-200" style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderWidth: '1px',
          color: 'rgb(185, 28, 28)'
        }}>
          {error}
        </div>
      )}

      {searchResults && (
        <div className="space-y-4">
          <FlightResults results={searchResults} />
        </div>
      )}
    </div>
  );
}