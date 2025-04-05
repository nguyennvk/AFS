import { useEffect, useState } from "react";
import AddRoomButton from "./addRoomButton";
import { useRouter } from "next/navigation";

export default function AddRoomForm({hotelId}: {hotelId: number}) {
  const router = useRouter();
  const [room, setRoom] = useState<Room>({
    room_number: "",
    room_type: "",
    room_price: "",
    room_amenities: "",
    room_images: [],
    hotel_id: hotelId,
  });
  useEffect(() => {
    router.push("/myHotels/fetch?hotelId=" + hotelId+"?option=addRoom");
  }, [hotelId, router]);

interface Room {
    room_number: string;
    room_type: string;
    room_price: string;
    room_amenities: string;
    room_images: File[];
    hotel_id: number;
}

interface ChangeEvent {
    target: {
        name: string;
        value: string;
    };
}

const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setRoom({ ...room, room_images: Array.from(e.target.files) });
    }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("room_number", room.room_number);
    formData.append("room_type", room.room_type);
    formData.append("room_price", room.room_price);
    formData.append("room_amenities", room.room_amenities);
    formData.append("hotel_id", String(room.hotel_id));
    
    room.room_images.forEach((file) => {
      formData.append("room_images", file);
    });
  
    try {
      const response = await fetch("/api/hotel/add/room", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit room data");
      }
  
      alert("Room data submitted successfully!");
      router.push("/myHotels/fetch?hotelId=" + hotelId);
    } catch (error) {
      console.error("Error submitting room data:", error);
      alert("Error submitting room data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 shadow-lg rounded-lg">
      <div>
        <label className="block font-medium">Hotel ID</label>
        <input type="number" name="hotelId" value={room.hotel_id} required className="w-full p-2 border rounded" disabled />
      </div>
      <div>
        <label className="block font-medium">Room Number</label>
        <input type="text" name="room_number" value={room.room_number} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block font-medium">Room Type</label>
        <input type="text" name="room_type" value={room.room_type} onChange={handleChange} required className="w-full p-2 border rounded" />

      </div>

      <div>
        <label className="block font-medium">Room Price ($)</label>
        <input type="number" name="room_price" value={room.room_price} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block font-medium">Room Amenities</label>
        <textarea name="room_amenities" value={room.room_amenities} onChange={handleChange} placeholder="E.g., WiFi, TV, Air Conditioning" required className="w-full p-2 border rounded"></textarea>
      </div>

      <div>
        <label className="block font-medium">Room Images</label>
        <input type="file" name="room_images" multiple onChange={handleFileChange} accept="image/*" className="w-full p-2 border rounded" />
      </div>
      <div className="flex justify-center">
        <AddRoomButton/>
      </div>
    </form>
  );
}