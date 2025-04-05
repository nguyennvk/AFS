import { useEffect, useState } from "react";
import HotelButtonWidget from "./hotelWidget";

interface HotelProps {
  hotel_name: string;
  hotel_logo?: string;
  hotel_description: string;
  hotel_id: number;
  hotel_rating: number;
}
export default function HotelOptions({ owner }: { owner: boolean }) {
  const [randomHotels, setRandomHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetch('/api/user/randomHotels');
      const data = await response.json();
      setRandomHotels(data);
    };

    fetchHotels();
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center relative mt-8" style={{ zIndex: 1, }}>
      {/* Debug message */}
      <div className="w-full text-center mb-4 p-2 rounded" 
           style={{  color: 'var(--foreground)', borderColor: 'var(--border)', borderWidth: '1px' }}>
        Random Hotels Section (Should be below search forms)
      </div>
      <div className="grid grid-cols-4 gap-6 bg-grey-200">
        {randomHotels.map((hotel: HotelProps, index: number) => (
          <div key={index} className="">
          <HotelButtonWidget
            key={hotel.hotel_id}
            hotel_id={hotel.hotel_id}
            hotel_name={hotel.hotel_name}
            hotel_logo={hotel.hotel_logo}
            hotel_description={hotel.hotel_description}
            owner={owner}
            hotel_rating={hotel.hotel_rating}
          />
          </div>
        ))}
      </div>
    </div>
  );
}
