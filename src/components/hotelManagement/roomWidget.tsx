import { useState, useEffect } from 'react';

// Room interface based on the structure you provided
interface Room {
  room_number: string;
  room_type: string;
  room_amenities: string;
  room_price: number;
  room_image_dir: string[]; // List of room images
}

export default function RoomWidget({ room }: { room: Room }) {
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Open modal with clicked image
  const openModal = (image: string) => {
    setModalImage(image);
  };

  // Close modal
  const closeModal = () => {
    setModalImage(null);
  };

  console.log("Room Widget:", room);
  return (
    <div className="room-widget border border-gray-300 rounded-lg p-4">
      {/* Main Room Image */}
      <div className="room-main-image mb-4">
        <img
          src={room.room_image_dir.length > 1 ? "/"+room.room_image_dir[0] : '/default/room.jpg'}
          alt="Main room"
          className="w-3/4 h-auto rounded-lg "
        />
      </div>

      {/* Room Details */}
      <div className="room-details mb-4">
        <h3 className="text-lg font-semibold">Room Number: {room.room_number}</h3>
        <p className="text-sm text-white">Price: ${room.room_price}</p>
        <h4 className="text-md font-semibold mt-2">Amenities</h4>
        <ul className="list-disc pl-5 text-sm text-white">
          {room.room_amenities.split(',').map((amenity, index) => (
            <li key={index}>{amenity.trim()}</li>
          ))}
        </ul>
      </div>

      {/* Other Images */}
      <div className="room-images flex gap-2">
        {room.room_image_dir.slice(1).map((image, index) => (
          <div key={index} className="image-thumbnail">
            <img
              src={"/"+image}
              alt={`Room image ${index + 1}`}
              className="w-16 h-16 object-cover rounded-md cursor-pointer"
              onClick={() => openModal(image)} // Open modal on click
            />
          </div>
        ))}
      </div>

      {/* Modal for Image */}
      {modalImage && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white p-4 rounded-lg relative">
            <img src={"/"+modalImage} alt="Room modal" className="w-full h-auto" />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition duration-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
