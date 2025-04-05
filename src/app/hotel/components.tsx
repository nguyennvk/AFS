"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ImageWidget from "./imageWidget";
import { set } from "date-fns";
import DatePicker from 'react-datepicker';
import RoomsList from "./availableRooms";
import "react-datepicker/dist/react-datepicker.css";


interface Hotel {
  hotel_id: number
  hotel_name: string
  hotel_street: string
  hotel_city: string
  hotel_country: string
  hotel_location_long: number
  hotel_location_lat: number
  hotel_review_point: number
  hotel_review_num: number
  hotel_description: string
  hotel_image_dir: string[]
}

export default function HotelPage() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [hotelId, setHotelId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]); // Adjust type as needed
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    router.push(`/hotel?hotelId=${hotelId}&startDate=${dates[0]?.toISOString().split('T')[0]}&endDate=${dates[1]?.toISOString().split('T')[0]}`);
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };


  useEffect(() => {
    async function fetchHotelData() {
      try {
        const hotelIdParam = searchParams.get("hotelId");
        setHotelId(hotelIdParam ? parseInt(hotelIdParam) : null);
        const response = await fetch(`/api/hotel/fetchById?hotelId=${hotelIdParam}`); // Adjust API endpoint as needed
        const data = await response.json();
        setHotel(data);
        if (!response.ok) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
      try{
        setLoading(true);
        const hotelIdParam = searchParams.get("hotelId");
        const hotelId = hotelIdParam ? parseInt(hotelIdParam) : null;
        setHotelId(hotelId);
        const room_response = await fetch(`/api/hotel/fetchRooms?hotelId=${hotelId}`);
        const room_data = await room_response.json();
        setRooms(room_data);
        if (!room_response.ok) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
      finally {
        setLoading(false);
      }
    }
    fetchHotelData();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
          <h1 className="text-3xl text-red-500 font-semibold">Error fetching hotel data</h1>
          <p className="text-gray-600 mt-2">Something went wrong. Please try again.</p>
          <button
            className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 cursor-pointer"
            onClick={() => router.push("/home")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!hotel) return <p className="text-center text-lg text-red-500">Failed to load hotel data.</p>;
  return (
    <div className="container mx-auto p-6 mt-5">
        {/* Hotel Info */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">{hotel.hotel_name}</h1>
          <p className="text-lg ">{hotel.hotel_street+" "+hotel.hotel_city+" "+hotel.hotel_country}</p>
        </div>
      {/* Hotel Images */}
      <ImageWidget images={hotel.hotel_image_dir}/>
      <p className="mt-4">{hotel.hotel_description}</p>

      <div className="mt-6">
        <div className="mr-4">
          <label htmlFor="startDate" className="text-lg text-white">Check-in Date:</label>
          <br></br>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={handleDateChange}
            minDate={new Date()}
            selectsRange
            startDate={startDate}
            endDate={endDate}
            className="mt-2 p-2 rounded-lg border border-gray-300"
            placeholderText="Select Check-in Date"
          />
        </div>
      </div>

      {/* Availability Section */}
      <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
      <RoomsList 
        hotelId={hotelId ?? 0}
        rooms={rooms} 
        startDate={startDate ? startDate.toISOString().split('T')[0] : ""} 
        endDate={endDate ? endDate.toISOString().split('T')[0] : ""} 
      />
    </div>
  );
}
