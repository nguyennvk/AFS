"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HotelOwn from '@components/displayHotels/hotelOwn';

export default function MyHotels() {
    const router = useRouter();
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetchOwnerStatus = async () => {
        const response = await fetch('/api/hotel');
        if (!response.ok) {
            setError(true);
        }
        };

        fetchOwnerStatus();
    }, []);
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl text-red-500">Error fetching hotel data</h1>
      </div>
    )
  }

  return (
    <div className="relative flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-10">My Hotels</h1>
        <button className="bg-blue-500 px-4 py-2 rounded mt-5 flex cursor-pointer hover:bg-blue-700" onClick={() => {router.push("/myHotels/add")}}>
          Add New Hotel
        </button>
        <HotelOwn owner={true} />
    </div>
  );
}