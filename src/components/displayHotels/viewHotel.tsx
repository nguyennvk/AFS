import React from "react";
import { useRouter } from "next/navigation";

export default function ViewHotelButton({ hotel_id, start, end}: { hotel_id: number, start: string, end: string }) {
    const router = useRouter();

    return (
        <button
            className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
            onClick={() => {
                router.push(`/hotel?hotelId=${hotel_id}startDate=${start}&endDate=${end}`);
            }}
        >
            View
        </button>
    );
}
