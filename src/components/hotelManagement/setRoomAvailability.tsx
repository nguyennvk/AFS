import { set } from 'date-fns';
import { useState, useEffect, use } from 'react';
import DatePicker from 'react-datepicker';

interface Room {
  room_type: string,
  availability: number,
  date: string
}



export default function RoomFilterBar({
  hotelId,
  setRoomCancelled,
  roomCancelled,
  trigger,
}: {
  hotelId: number;
  setRoomCancelled: React.Dispatch<React.SetStateAction<Room | null>>;
  roomCancelled: Room | null;
  trigger: () => void;
})  {
  const [roomType, setRoomType] = useState([]);
  const [roomTypeSelected, setRoomTypeSelected] = useState('');
  const [availability, setAvailability] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch('/api/hotel/fetchRoomTypes?hotelId=' + hotelId);
        if (!response.ok) {
          throw new Error('Failed to fetch room types');
        }
        const data = await response.json();
        const roomTypes = data.map((room: { room_type: string }) => room.room_type);
        setRoomType(roomTypes);
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };
    fetchRoomTypes();
  }, []);


  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-sm w-full max-w-3xl mx-auto w-3/4">
      
      {/* Room Type Dropdown */}
      <div className="flex flex-col">
        <label className="text-sm text-white mb-1">Room Type</label>
        <select
          value={roomTypeSelected}
          onChange={(e) => {setRoomTypeSelected(e.target.value)
          setRoomCancelled(roomCancelled ? { ...roomCancelled, room_type: e.target.value } : { room_type: e.target.value, availability: 0, date: '' })
          }}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {roomType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Number Input */}
      <div className="flex flex-col">
        <label className="text-sm text-white mb-1">Room Availability</label>
        <input
          type="number"
          min={1}
          value={availability}
          onChange={(e) => {setAvailability(Number(e.target.value))
          setRoomCancelled(roomCancelled ? { ...roomCancelled, availability: Number(e.target.value) } : { room_type: '', availability: Number(e.target.value), date: '' })
          }}
          className="border rounded-md px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date Picker */}
      <div className="flex flex-col">
        <label className="text-sm text-w-700 mb-1">Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {setSelectedDate(date)
            setRoomCancelled(roomCancelled ? { ...roomCancelled, date: date ? date.toISOString().split('T')[0] : '' } : { room_type: '', availability: 0, date: date ? date.toISOString().split('T')[0] : '' })
          }}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholderText="Choose a date"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <button onClick ={() => {trigger()}}
       className="bg-blue-500 text-white mt-6 px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
        Apply
      </button>
    </div>
  );
}
