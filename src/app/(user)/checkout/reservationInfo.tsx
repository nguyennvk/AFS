import React, { useState } from 'react';

interface Reservation {
  reservation_id: number;
  hotel_id: number;
  room_number: string;
  customer_id: number;
  start_date: string;
  end_date: string;
  status: string;
  total_price: number;
  room_type: string;
  hotel_name: string;
}

interface ReservationProps {
  hotelReservations: Reservation[];
}

const ReservationPage: React.FC<ReservationProps> = ({ hotelReservations }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Calculate the total cost of all reservations
  const totalReservationCost = hotelReservations.reduce(
    (acc, reservation) => acc + reservation.total_price,
    0
  );

  const handlePayment = (paymentMethod: string) => {
    setPaymentStatus(`Payment completed using ${paymentMethod}`);
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Hotel Reservations</h1>

      {/* Hotel Reservations */}
      <div className="p-4 rounded-lg shadow-sm">

      {hotelReservations.length > 0 ? (
        hotelReservations.map((reservation, index) => (
          <div key={index} className="mt-4">
              <h3 className="text-lg font-bold text-blue-600">Reservation ID: {reservation.reservation_id}</h3>
              <p><strong>Hotel Name:</strong> {reservation.hotel_name}</p>
              <p><strong>Room Number:</strong> {reservation.room_number}</p>
              <p><strong>Room Type:</strong> {reservation.room_type}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
              <p><strong>Start Date:</strong> {reservation.start_date}</p>
              <p><strong>End Date:</strong> {reservation.end_date}</p>
              <p><strong>Total Price:</strong> ${reservation.total_price.toFixed(2)}</p>
          </div>
        ))
      ) : (
        <p>No hotel reservations found.</p>
      )}
      </div>


      {/* Total Price */}
      {hotelReservations.length > 0 && (
        <div className="mt-6 text-right font-semibold text-xl">
          <p><strong>Total for All Reservations: ${totalReservationCost.toFixed(2)}</strong></p>
        </div>
      )}

    </div>
  );
};

export default ReservationPage;
