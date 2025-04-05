// export default ReservationList;
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Reservation {
  reservation_id: number;
  room_number: string;
  room: { room_type: string };
  start_date: string;
  end_date: string;
}

const ReservationList = ({ hotelId }: { hotelId: number }) => {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch reservations and room types whenever startDate, endDate, or selectedRoomType change
  useEffect(() => {
    router.push("/myHotels/fetch?hotelId=" + hotelId + "&option=Reservation List&start=" + (startDate ? startDate.toISOString().split("T")[0] : "") + "&end=" + (endDate ? endDate.toISOString().split("T")[0] : "")+ "&room_type=" + selectedRoomType);
    fetchReservations();
    fetchRoomTypes();
    console.log(reservations)
  }, [startDate, endDate, selectedRoomType]);

  const fetchReservations = async () => {
    try {
      // Format startDate and endDate to ISO strings
      const start = startDate ? startDate.toISOString().split("T")[0] : "";
      const end = endDate ? endDate.toISOString().split("T")[0] : "";
      console.log("Fetching reservations with start:", start, "end:", end);


        const response = await fetch("/api/hotel/fetchReservation?hotel_id=" + hotelId+"&start="+start+"&end="+end+"&room_type="+selectedRoomType);

      if (!response.ok) {
        setErrorMessage("Failed to fetch reservations");
        return;
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setErrorMessage("Error fetching reservations");
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`/api/hotel/fetchRoomTypes?hotelId=${hotelId}`);
      if (!response.ok) {
        setErrorMessage("Failed to fetch room types");
        return;
      }
      const data = await response.json();
      setRoomTypes(data.map((room: { room_type: string }) => room.room_type));
    } catch (error) {
      console.error("Error fetching room types:", error);
      setErrorMessage("Error fetching room types");
    }
  };

  const cancelReservation = async (id: number) => {
    try {
      await fetch("/api/hotel/cancel-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotel_id: hotelId, reservations: [id] }),
      });
      // Update state to reflect the canceled reservation without a page reload
      setReservations(reservations.filter((res) => res.reservation_id !== id));
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl text-red-500">{errorMessage}</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <div className="flex justify-between mb-4">

        <div className="mb-4">
          <DatePicker
          selected={startDate}
          onChange={(dates: any) => {
            setStartDate(dates[0]);
            setEndDate(dates[1]);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          placeholderText="Select Date Range"
        />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Room Type: </label>
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th className="p-2 border border-gray-300">Reservation ID</th>
            <th className="p-2 border border-gray-300">Room Type</th>
            <th className="p-2 border border-gray-300">Check-In</th>
            <th className="p-2 border border-gray-300">Check-Out</th>
            <th className="p-2 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.reservation_id}>
              <td className="p-2 border border-gray-300">{res.reservation_id}</td>
              <td className="p-2 border border-gray-300">{res.room.room_type}</td>
              <td className="p-2 border border-gray-300">{res.start_date.split("T")[0]}</td>
              <td className="p-2 border border-gray-300">{res.end_date.split("T")[0]}</td>
              <td className="p-2 border border-gray-300">
                <button
                  onClick={() => cancelReservation(res.reservation_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;
