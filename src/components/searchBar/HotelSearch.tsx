'use client';

import React, { useState } from 'react';
import SearchFrom from './searchFrom';
import ViewHotelButton from '../displayHotels/viewHotel';

interface Hotel {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  rating: {
    points: number;
    numberOfReviews: number;
  };
  description: string;
  images: {
    logo: string;
    directory: string;
  };
  startingPrice: number;
  availableRooms: Array<{
    number: string;
    type: string;
    price: number;
    amenities: string[];
  }>;
}

interface HotelSearchState {
  searchParams: {
    city: string;
    checkIn: string;
    checkOut: string;
    minPrice: string;
    maxPrice: string;
    minRating: string;
    maxRating: string;
  };
  isLoading: boolean;
  error: string | null;
  results: {
    hotels: Hotel[];
    totalResults: number;
    message: string | null;
  } | null;
}

export default function HotelSearch(): JSX.Element {
  const [state, setState] = useState<HotelSearchState>({
    searchParams: {
      city: '',
      checkIn: '',
      checkOut: '',
      minPrice: '0',
      maxPrice: '1000',
      minRating: '0',
      maxRating: '5'
    },
    isLoading: false,
    error: null,
    results: null
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.searchParams.city.trim()) {
      const confirmSearch = confirm("You haven't specified a city. This will search across ALL hotels and may be slow. Continue?");
      if (!confirmSearch) {
        return;
      }
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const queryParams = new URLSearchParams({
        city: state.searchParams.city,
        checkIn: state.searchParams.checkIn,
        checkOut: state.searchParams.checkOut,
        minPrice: state.searchParams.minPrice.toString(),
        maxPrice: state.searchParams.maxPrice.toString(),
        minRating: state.searchParams.minRating.toString(),
        maxRating: state.searchParams.maxRating.toString()
      });

      const response = await fetch(`/api/hotel-search?${queryParams}`);
      const data = await response.json();
      console.log('Hotel search response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to search hotels');
      }

      setState(prev => ({ 
        ...prev, 
        results: data.data, 
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      }));
    }
  };

  return (
    <div className="space-y-8" data-testid="hotel-search">
      <div className="rounded-lg shadow-lg p-6 transition-all duration-300" 
           style={{ backgroundColor: 'var(--form-bg)', borderColor: 'var(--border)' }}>
        <form onSubmit={handleSearch} className="space-y-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Hotel Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>City</label>
              <SearchFrom
                value={state.searchParams.city}
                onChange={(value) => setState(prev => ({
                  ...prev,
                  searchParams: { ...prev.searchParams, city: value }
                }))}
                placeholder="Enter city"
                showLabel={false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Check-in Date</label>
              <input
                type="date"
                value={state.searchParams.checkIn}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  searchParams: { ...prev.searchParams, checkIn: e.target.value }
                }))}
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

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Check-out Date</label>
              <input
                type="date"
                value={state.searchParams.checkOut}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  searchParams: { ...prev.searchParams, checkOut: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--form-input-bg)', 
                  color: 'var(--input-text)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px'
                }}
                placeholder="dd/mm/yyyy"
                min={state.searchParams.checkIn}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={state.searchParams.minPrice}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    searchParams: { ...prev.searchParams, minPrice: e.target.value}
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ 
                    backgroundColor: 'var(--form-input-bg)', 
                    color: 'var(--input-text)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px'
                  }}
                  placeholder="Min Price"
                />
                <span style={{ color: 'var(--foreground)' }}>-</span>
                <input
                  type="number"
                  value={state.searchParams.maxPrice}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    searchParams: { ...prev.searchParams, maxPrice: e.target.value}
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ 
                    backgroundColor: 'var(--form-input-bg)', 
                    color: 'var(--input-text)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px'
                  }}
                  placeholder="Max Price"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Rating Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={state.searchParams.minRating}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    searchParams: { ...prev.searchParams, minRating: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ 
                    backgroundColor: 'var(--form-input-bg)', 
                    color: 'var(--input-text)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px'
                  }}
                  placeholder="Min Rating"
                />
                <span style={{ color: 'var(--foreground)' }}>-</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={state.searchParams.maxRating}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    searchParams: { ...prev.searchParams, maxRating: e.target.value}
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ 
                    backgroundColor: 'var(--form-input-bg)', 
                    color: 'var(--input-text)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px'
                  }}
                  placeholder="Max Rating"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: state.isLoading ? '#94a3b8' : 'var(--button-bg)',
              color: 'var(--button-text)'
            }}
          >
            {state.isLoading ? 'Searching...' : 'Search Hotels'}
          </button>
        </form>
      </div>

      {state.error && (
        <div className="bg-red-100/50 dark:bg-red-900/50 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg transition-colors">
          {state.error}
        </div>
      )}

      {state.results && (
        <div className="space-y-4">
          {state.results.hotels.length === 0 ? (
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center transition-colors">
              <p className="text-lg text-gray-700 dark:text-gray-300">No hotels found matching your search criteria.</p>
              {state.results.message && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{state.results.message}</p>
              )}
            </div>
          ) : (
            state.results.hotels
            .filter((hotel) => hotel.startingPrice > 0)
            .map((hotel) => (
              <div key={hotel.id} className="backdrop-blur-sm rounded-lg shadow-lg p-4 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold light:text-black">{hotel.name}</h3>
                    <p className="light:text-gray-600">
                      {hotel.address.street}, {hotel.address.city}, {hotel.address.country}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hotel.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${hotel.startingPrice}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">per night</p>
                    <ViewHotelButton hotel_id={hotel.id} start={state.searchParams.checkIn} end={state.searchParams.checkOut}></ViewHotelButton>
                  </div>
                </div>
              </div>
            ))

          )}
        </div>
      )}
    </div>
  );
} 