import React, { useState } from 'react';
import InspectHotelButton from './inspectHotel';
import ViewHotelButton from './viewHotel';
import Rating from './rating';
interface HotelProps {
    hotel_id: number;
    hotel_name: string;
    hotel_logo?: string;
    hotel_description: string;
    owner: boolean;
    hotel_rating: number;
  }

  

export default function HotelButtonWidget({hotel_id, hotel_name, hotel_logo, hotel_description, owner, hotel_rating}: HotelProps) {
  if (owner) {
    return (
          <div className=" p-4 rounded-lg border-1 shadow-lg relative w-90 relative h-100 flex flex-col items-center text-center relative">
        <img
          src={hotel_logo || "default/hotel.jpg"}
          alt="image"
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <h2 className="text-xl font-bold mt-2">{hotel_name}</h2>
        <p className="mt-1 px-2 text-sm line-clamp-3">{hotel_description}</p>
        <Rating rating={hotel_rating ?? 0} />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <InspectHotelButton hotel_id={hotel_id}></InspectHotelButton>
          </div>
        
        
      </div>
      );
    } else {
      return (
        <div className="p-4 rounded-lg shadow-lg border-1 relative w-85 relative h-100 flex flex-col items-center text-center relative">
      <img
        src={hotel_logo || "default/hotel.jpg"}
        alt="image"
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <h2 className="text-xl font-bold mt-2">{hotel_name}</h2>
      <p className="mt-1 px-2 text-sm line-clamp-3">{hotel_description}</p>
      <Rating rating={hotel_rating} />
  
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <ViewHotelButton hotel_id={hotel_id} start={""} end={""}></ViewHotelButton>
        </div>
      
      
    </div>
    );
    }
  
  }