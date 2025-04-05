
import React from 'react';

interface Flight {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  price: number;
  airline: {
    code: string;
    name: string;
  };
}

interface Booking {
  bookingReference: string;
  firstName: string;
  lastName: string;
  email: string;
  passportNumber: string;
  status: string;
  flights: Flight[];
}

const BookingInfo: React.FC<{ booking: Booking }> = ({ booking }) => {
  const totalFlightPrice = booking.flights.reduce((acc, flight) => acc + flight.price, 0);

  return (
    <div className="p-6 rounded-lg shadow-lg my-4">
      <h2 className="text-2xl font-semibold text-indigo-600">Booking Information</h2>
      <div className="mt-4">
        <p><strong className="">Booking Reference:</strong> {booking.bookingReference}</p>
        <p><strong className="">Passenger Name:</strong> {booking.firstName} {booking.lastName}</p>
        <p><strong className="">Email:</strong> {booking.email}</p>
        <p><strong className="">Passport Number:</strong> {booking.passportNumber}</p>
        <p><strong className="">Status:</strong> {booking.status}</p>
      </div>

      <h3 className="text-xl font-semibold text-blue-600 mt-6">Flight Details</h3>
      {booking.flights.map((flight, index) => (
        <div key={index} className="mt-4">
          <p><strong className="">Flight Number:</strong> {flight.flightNumber}</p>
          <p><strong className="">Departure Time:</strong> {flight.departureTime}</p>
          <p><strong className="">Arrival Time:</strong> {flight.arrivalTime}</p>
          <p><strong className="">From:</strong> {flight.origin.city}, {flight.origin.country} ({flight.origin.code})</p>
          <p><strong className="">To:</strong> {flight.destination.city}, {flight.destination.country} ({flight.destination.code})</p>
          <p><strong className="">Airline:</strong> {flight.airline.name} ({flight.airline.code})</p>
          <p><strong className="">Price:</strong> ${flight.price}</p>
          <hr className="my-4" />
        </div>
      ))}
      <p className="mt-4 text-right font-semibold text-xl">Total Flight Cost: ${totalFlightPrice.toFixed(2)}</p>
    </div>
  );
};

export default BookingInfo;
