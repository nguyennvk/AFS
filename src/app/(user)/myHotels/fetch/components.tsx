"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import AddRoomForm from "@components/hotelManagement/addRoomForm";
import RoomAvailabilityPage from "@components/hotelManagement/roomAvailability";
import ReservationList from "@components/hotelManagement/bookingList";
import RoomManagementPage from "@components/hotelManagement/roomManagement";

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  hotel_logo?: string;
  hotel_description: string;
  owner: boolean;}


export default function HotelDashboard() {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [hotelId, setHotelId] = useState<number | null>(null);
    const [error, setError] = useState(false);
    const searchParams = useSearchParams();
    const [selectedOption, setSelectedOption] = useState("Add Room");
    const router = useRouter();

  
    useEffect(() => {
        const hotelIdParam = searchParams.get("hotelId");
        setHotelId(hotelIdParam ? parseInt(hotelIdParam) : null);
        fetch(`/api/hotel/fetch?hotelId=${hotelIdParam}`)
        .then((res) => {
          if (!res.ok) {
            setError(true) // Handle non-200 responses
          }
          return res.json(); // Proceed to parse the response as JSON if status is OK
        })
        .then((data) => {
          setHotel(data); // Proceed with the data if fetch was successful
        })
        .catch((error) => {
          console.error("Error fetching hotel:", error); // Handle errors
        });
  
    }, [hotelId, searchParams]);
  
    if (error) {
      return (
        <div className="flex justify-center items-center h-screen ">
        <div className=" p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
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
      
      )
    }
  
  
    const menuOptions = [
      "Add Room",
      "View Availability",
      "Booking List",
      "Room Management"
    ];
  
    return (
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-6">
          <h2 className="text-xl font-bold mb-4">{hotel?.hotel_name}</h2>
          <ul>
            {menuOptions.map((option) => (
              <li
                key={option}
                className={`p-3 cursor-pointer rounded-lg mb-2 ${
                  selectedOption === option ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
  
        {/* Right Content Area */}
        <div className="w-3/4 p-6">
          <h2 className="text-2xl font-semibold mb-4">{selectedOption}</h2>
          <div className=" p-4 rounded-lg shadow-md text-white">
            {selectedOption === "Add Room" && hotelId !== null && <AddRoomForm hotelId={hotelId} />}
            {selectedOption === "View Availability" && hotelId !== null && <RoomAvailabilityPage hotelId={hotelId}></RoomAvailabilityPage>}
            {selectedOption === "Booking List" && hotelId !== null && <ReservationList hotelId={hotelId} />}
            {selectedOption === "Room Management" && hotelId !== null && <RoomManagementPage hotelId={hotelId} />}
          </div>
        </div>
      </div>
    );
  }
  