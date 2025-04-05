"use client";
import React, { useState } from "react";
import Header from "../components/header/Header";
import SearchOption from "../components/option/searchOption";
import HotelSearch from "../components/searchBar/HotelSearch";
import HotelOptions from "../components/displayHotels/hotelOptions";
import FlightSearch from "../components/searchBar/FlightSearch";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("flight");
  
  // Hotel search state 
  const [hotelSearchParams, setHotelSearchParams] = useState({
    city: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    maxRating: 5
  });
  
  // Handler for hotel search form
  const handleHotelSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting hotel search with params:", hotelSearchParams);
    
    // Here you would make the API call with the search parameters
    try {
      const queryParams = new URLSearchParams({
        city: hotelSearchParams.city,
        minPrice: hotelSearchParams.minPrice.toString(),
        maxPrice: hotelSearchParams.maxPrice.toString(),
        minRating: hotelSearchParams.minRating.toString(),
        maxRating: hotelSearchParams.maxRating.toString()
      });
      
      alert(`Search parameters: ${queryParams.toString()}\nMinimum rating: ${hotelSearchParams.minRating}\nMaximum rating: ${hotelSearchParams.maxRating}`);
      
    } catch (error) {
      console.error("Hotel search error:", error);
    }
  };

  const handleOptionChange = (option: string) => {
    console.log("Home component - option changed to:", option);
    setSelectedOption(option);
  };

  return(
    <div className="relative pt-16 min-h-screen transition-all duration-300" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Header />
      <SearchOption onOptionChange={handleOptionChange} />
      
      <div className="container mx-auto px-4 py-8">
        {selectedOption === "flight" && (
          <div className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <FlightSearch />
            </div>
            <div className="mt-8">
              <HotelOptions owner={false}/>
            </div>
          </div>
        )}
        
        {selectedOption === "hotel" && (
          <div className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <HotelSearch />
            </div>
            <div className="mt-8">
              <HotelOptions owner={false}/>
            </div>
          </div>
        )}
        
        {selectedOption === "flightHotel" && (
          <div className="space-y-12">
            <section className="max-w-4xl mx-auto">
              <FlightSearch />
            </section>
            
            <section className="max-w-4xl mx-auto">
              <HotelSearch />
            </section>
            
            <section className="mt-8">
              <HotelOptions owner={false}/>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
