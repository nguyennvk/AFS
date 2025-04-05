import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Room {
  room_number: string;
  room_image: string;
  room_amenities: string[];
  room_price: number;
}

interface RoomsListProps {
  hotelId: number;
  rooms: Room[];
  startDate: string;
  endDate: string;
}

const RoomsList: React.FC<RoomsListProps> = ({ hotelId, rooms, startDate, endDate}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const router = useRouter();
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.room_number} className="border rounded-lg shadow-md p-4">
            <img
              src={room.room_image || "default/room.jpg"}
              alt={`Room ${room.room_number}`}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-2">Room {room.room_number}</h3>
            <p className="text-sm text-gray-600">
              Amenities: {room.room_amenities}
            </p>
            <p className="text-md font-bold mt-2">${room.room_price} per night</p>
            <div className="flex justify-center mt-2">
              <button
                onClick={async () => {
                  if (!startDate || !endDate) {
                    alert("Please select both start and end dates.");
                    return;
                  }
                  setSelectedRoom(room);
                  const isLoggedIn = await fetch("/api/protected");
                  if (isLoggedIn.status === 200) {
                    // router.push(`/hotel/roomDetails?roomId=${room.room_number}`);
                  } else {
                    alert("You must be logged in to reserve a room.");
                    router.push("/login");
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer"
              >
                Reserve Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            
            <h2 className="text-xl font-bold text-black">Room {selectedRoom.room_number}</h2>
            <img
              src={selectedRoom.room_image || "default/room.jpg"}
              alt={`Room ${selectedRoom.room_number}`}
              className="w-full h-40 object-cover rounded-md my-2"
            />
            <p className="text-sm text-gray-600">
              Amenities: {selectedRoom.room_amenities}
            </p>
            <p className="text-md font-bold text-black">${selectedRoom.room_price} per night</p>
            <p className="text-sm text-gray-600">
              Start Date: {startDate}
            </p>
            <p className="text-sm text-gray-600">
              End Date: {endDate}
            </p>
            <p className="text-sm text-gray-600">
              Total Price: ${selectedRoom.room_price * (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)}
            </p>
            <div className="flex space-x-4">
            <button
              onClick={() => {
                setSelectedRoom(null)
                router.push(`/reservation?hotelId=${hotelId}&room_number=${selectedRoom.room_number}&startDate=${startDate}&endDate=${endDate}`);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg w-full hover:bg-green-600 transition duration-200 cursor-pointer"
            >
              Confirm
            </button>
            <button
              onClick={() => setSelectedRoom(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsList;
