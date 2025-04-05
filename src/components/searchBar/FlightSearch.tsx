"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import FlightResults from './FlightResults';
import AutocompleteInput from './autoCompleteInput';

export default function FlightSearch() {
  const [flightResults, setFlightResults] = useState({});
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    isRoundTrip: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/flight-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: searchParams.origin,
          destination: searchParams.destination,
          date: [searchParams.departureDate, searchParams.returnDate],
          isRoundTrip: searchParams.isRoundTrip,
        }),
      });
      const data = await response.json();
      console.log('Flight search response:', data);
      if (!response.ok) {
        setFlightResults({ error: data.error });
      }
      setFlightResults(data);
      console.log('Flight search results:', data);

      // Handle the search results as needed
    } catch (error) {
      console.error('Error searching flights:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-550">From</label>
          <input
            type="text"
            id="origin"
            value={searchParams.origin}
            onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
            className="mt-1 block w-full rounded-md border-1 border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
            {/* <AutocompleteInput
            suggestions={['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']}
            placeholder="Choose a city..."
            onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
          /> */}
        </div>
        
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-550">To</label>
          <input
            type="text"
            id="destination"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
            className="mt-1 block w-full rounded-md border-1 border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="departureDate" className="block text-sm font-medium text-gray-550">Departure Date</label>
          <input
            type="date"
            id="departureDate"
            value={searchParams.departureDate}
            onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-1 border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-550">Return Date</label>
          <input
            type="date"
            id="returnDate"
            disabled={!searchParams.isRoundTrip}
            value={searchParams.returnDate}
            onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-1 border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-yellow-500"
          />
        </div>
        
      </div>

      <div className="flex items-center ">
      <input
          type="checkbox"
          id="isRoundTrip"
          checked={!searchParams.isRoundTrip}
          onChange={(e) => setSearchParams({ ...searchParams, isRoundTrip: !e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded "
        />
        <label htmlFor="isRoundTrip" className="ml-2 block text-sm">One-way</label>
        <input
          type="checkbox"
          id="isRoundTrip"
          checked={searchParams.isRoundTrip}
          onChange={(e) => setSearchParams({ ...searchParams, isRoundTrip: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ml-4"
        />
        <label htmlFor="isRoundTrip" className="ml-2 block text-sm">Round Trip</label>
        
      </div>

      <button
        type="submit"
        onSubmit={handleSubmit}
        className="w-full bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
      >
        Search Flights
      </button>
      <FlightResults results={flightResults} />
    </form>
  );
} 