import React, { useState, useEffect } from 'react';
import HotelOption from './hotelSearchButton';
import FlightOption from './flightSearchButton';
import FlightHotelOption from './flightHotelSearchButton';

interface SearchOptionProps {
  onOptionChange?: (option: string) => void;
}

export default function SearchOption({ onOptionChange }: SearchOptionProps) {
  // State to manage the selected option
  const [selectedOption, setSelectedOption] = useState({
    hotel: false,
    flight: true, // Default to flight selected
    flightHotel: false
  });

  // Call the parent's onOptionChange when selectedOption changes
  useEffect(() => {
    if (selectedOption.hotel && onOptionChange) {
      onOptionChange('hotel');
    } else if (selectedOption.flight && onOptionChange) {
      onOptionChange('flight');
    } else if (selectedOption.flightHotel && onOptionChange) {
      onOptionChange('flightHotel');
    }
  }, [selectedOption, onOptionChange]);

  const choseOption = (option: string) => {
    setSelectedOption({hotel: false, flight: false, flightHotel: false});
    setSelectedOption((prevState) => ({ ...prevState, [option]: true }));
  }

  return (
    <div className="w-full flex justify-center py-4 mb-4 gap-4">
      <HotelOption title="Hotel" isSelected={selectedOption.hotel} choseOption={choseOption}/>
      <FlightOption title="Flight" isSelected={selectedOption.flight} choseOption={choseOption}/>
      <FlightHotelOption title="Flight + Hotel" isSelected={selectedOption.flightHotel} choseOption={choseOption}/>
    </div>
  );
};
  
