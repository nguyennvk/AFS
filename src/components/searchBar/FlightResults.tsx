'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface FlightResult {
  flightNumbers: string[];
  airlines: string[];
  departure: Object;
  arrival: Object;
  duration: string;
  price: number;
  id: string;
}

interface FlightResultsProps {
  results: {
    success: boolean;
    outbound: {
      results: FlightResult[];
      total: number;
    };
    return?: {
      results: FlightResult[];
      total: number;
    };
    tripType: 'one-way' | 'roundtrip';
  };
}

export default function FlightResults({ results }: FlightResultsProps) {
  const router = useRouter();
  if (!results.success || (!results.outbound.total && (!results.return || !results.return.total))) {
    return (
      <div className="backdrop-blur-sm rounded-lg shadow-lg p-6 text-center transition-colors">
        <p className="text-lg">No flights found matching your search criteria.</p>
      </div>
    );
  }

  const renderFlights = (flights: FlightResult[], title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {flights.map((flight, index) => (
        <div key={index} className="backdrop-blur-sm rounded-lg shadow-lg p-4 transition-colors border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{flight.airlines.map(a => a.name).join(', ')}</p>
              <p className="text-sm ">Flight: {flight.flightNumbers.join(", ")}</p>
              <div className="mt-2">
                <p className="">
                  Departure time: {flight.departure.time}
                </p>
                <p className="">
                  Arrival time: {flight.arrival.time}
                </p>
                <p className="">
                  Duration: {flight.duration}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${flight.price}
              </p>
              <button
                onClick={async () => {
                  try {
                    const valid = await fetch('/api/protected', {
                      credentials: 'include',
                    });
                    if (valid.ok) {
                      router.push('/flight/booking?flightId=' + flight.id);
                      return;
                    } else {
                      alert('Please login to continue');
                    }
                  } catch (error) {
                    console.error('Network error:', error);
                    alert('Something went wrong. Please try again later.');
                  }
                }}
                className="w-full bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
              >
                
                Book now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {renderFlights(results.outbound.results, results.tripType === 'roundtrip' ? 'Outbound Flights' : 'Available Flights')}
      {results.tripType === 'roundtrip' && results.return && (
        renderFlights(results.return.results, 'Return Flights')
      )}
    </div>
  );
} 