import React, { useState } from "react";

interface FlightHotelOptionButtonProps {
    title: string;
    isSelected: boolean;
    choseOption: (option: string) => void;
}

export default function FlightHotelOption({isSelected, title, choseOption}: FlightHotelOptionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={() => choseOption("flightHotel")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-2 px-4 rounded-lg transition-all font-medium border-2 cursor-pointer"
      style={{
        backgroundColor: isSelected 
          ? (isHovered ? 'var(--primary-hover)' : 'var(--primary)')
          : (isHovered ? 'var(--primary-light)' : 'transparent'),
        color: isSelected 
          ? 'var(--button-text)' 
          : (isHovered ? 'var(--primary-hover)' : 'var(--primary)'),
        borderColor: isHovered ? 'var(--primary-hover)' : 'var(--primary)'
      }}
    >
      {title}
    </button>
  );
};

