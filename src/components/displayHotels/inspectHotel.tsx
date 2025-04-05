import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function InspectHotel({hotel_id}: {hotel_id: number}) {
    const router = useRouter();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    return (
        <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
            onClick={() => {
                router.push(`/myHotels/fetch?hotelId=${hotel_id}`);
            }}
        >
            Inspect
        </button>
    );
}