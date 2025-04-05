import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface RoomAvailability {
  room_type: string;
  _count: {room_type: number};
}

export default function RoomAvailabilityPage({hotelId}: {hotelId: number}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const router = useRouter();

  useEffect(() => {
    router.push("/myHotels/fetch?hotelId="+hotelId+"?option=Room Availability");
  }, []);

  async function fetchAvailability() {
    if (!startDate || !endDate) return;
    try {
      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        hotel_id: hotelId.toString(),
      });
      const response = await fetch(`/api/hotel/view-availability?${params}`);
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error("Error fetching room availability", error);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Room Availability</h1>
      <div className="flex gap-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="border p-2 rounded"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          className="border p-2 rounded"
        />
        <button onClick={fetchAvailability} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500">
            <th className="border p-2">Room Type</th>
            <th className="border p-2">Available Rooms</th>
          </tr>
        </thead>
        <tbody>
        {availability.length > 0 ? (
  availability.map((item) => (
    <tr key={item.room_type}>
      <td className="border p-2">{item.room_type}</td>
      <td className="border p-2">{item._count?.room_type ?? 0}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={2} className="border p-2 text-center">
      No data available
    </td>
  </tr>
)}

        </tbody>
      </table>
    </div>
  );
}
