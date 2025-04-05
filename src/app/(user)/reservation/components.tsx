"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await fetch(`/api/booking/add-booking`, {
            method: "POST", 
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              flightIds: [],
              hotel_id: searchParams.get("hotelId"),
              room_number: searchParams.get("room_number"),
              start_date: searchParams.get("startDate"),
              end_date: searchParams.get("endDate"),
            }),
        });
        if (!res.ok) {
          setError(true);
          const response = await res.json();
          setErrorMessage(response.error);

        } else {
          const data = await res.json();
          setReservation(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl text-white">Loading...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl text-red-500">{errorMessage || "Error fetching reservation data"}</h1>
        <br />
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer"
          onClick={() => router.back()}
        >
        Go back
        </button>
      </div>
    );
  }
  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl text-red-500">No reservation found</h1>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 rounded-lg shadow-lg bg-gray-800 text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Reservation successful</h1>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer"
          onClick={() => router.push("/home")}
        >
          Go back Home
        </button>
      </div>
    </div>
  );}