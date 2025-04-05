"use client";
import React, { useState, useEffect, useContext } from "react";
import SearchOption from "@components/option/searchOption";
import SearchComponent from "@components/searchBar/searchComponent";
import HotelOptions from "@components/displayHotels/hotelOptions";
import FlightSearch from "@components/searchBar/FlightSearch";
import { useRouter } from "next/navigation";
import HotelSearch from "@components/searchBar/HotelSearch";

export default function Home() {
    const [selectedOption, setSelectedOption] = useState("flight");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hotelSearchParams, setHotelSearchParams] = useState({
    city: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    maxRating: 5
    });
    const router = useRouter();

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/protected", { credentials: "include" });
            if (!res.ok) {
                router.push("/");
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };
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
    
    

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
      <div className="relative pt-16 min-h-screen transition-all duration-300" >
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
                  <div className="max-w-4xl mx-auto text-">
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
    );
}
