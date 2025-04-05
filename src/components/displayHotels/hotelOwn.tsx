import { useEffect, useState } from "react";
import HotelButtonWidget from "./hotelWidget";

interface HotelProps {
  hotel_name: string;
  hotel_logo?: string;
  hotel_description: string;
  hotel_id: number;
  hotel_rating: number;
}
export default function HotelOwn({ owner }: { owner: boolean }) {
  const [myHotels, setmyHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      
      const response = await fetch('/api/hotel');
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
      const data = await response.json();
      setmyHotels(data);
    };

    fetchHotels();
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center relative mt-40">
      <div className="grid grid-cols-4 gap-6">
        {myHotels.map((hotel: HotelProps) => (
          <HotelButtonWidget
            key={hotel.hotel_id}
            hotel_id={hotel.hotel_id}
            hotel_name={hotel.hotel_name}
            hotel_logo={hotel.hotel_logo}
            hotel_description={hotel.hotel_description}
            owner={owner}
            hotel_rating={hotel.hotel_rating}
          />
        ))}
      </div>
    </div>
  );
}
