import React from 'react';

interface Flight {
  bookingReference: string;
  flightNumber: string
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

const FlightInfo: React.FC<{ flights: Flight[] }> = ({ flights }) => {
  console.log(flights)
  const totalPrice = flights.reduce((sum, flight) => sum + flight.price, 0);

  return (
    <div className="p-6 rounded-lg shadow-lg my-4">
      <h2 className="text-2xl font-semibold">Flight Details</h2>
      {flights.map((flight, index) => (
        <div key={flight.id} className="mt-4">
          <p><strong>Airline:</strong> {flight.airline.name} ({flight.airline.code})</p>
          <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
          <p><strong>Departure Time:</strong> {flight.departureTime}</p>
          <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
          <p><strong>From:</strong> {flight.origin.name} ({flight.origin.code}), {flight.origin.city}, {flight.origin.country} </p>
          <p><strong>To:</strong> {flight.destination.name} ({flight.destination.code}), {flight.destination.city}, {flight.destination.country} </p>
          <p><strong>Price:</strong> ${flight.price}</p>
          <hr className="my-4" />
        </div>
      ))}
      <p className="mt-4 text-right font-semibold text-xl">Total Flight Cost: ${totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default FlightInfo;
