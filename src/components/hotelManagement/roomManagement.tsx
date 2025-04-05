import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RoomWidget from "./roomWidget";
import SetRoomAvailability from "./setRoomAvailability";

interface Room {
    room_type: string,
    availability: number,
    date: string
}

export default function RoomManagementPage({hotelId}: {hotelId: number}) {
    const router = useRouter();
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [roomCancelled, setRoomCancelled] = useState<Room | null>(null);

    const applyRoomFilter = async() => {

        if (!roomCancelled) {
            return;
        }
        if (!roomCancelled.availability) {
            return;
        }
        if (roomCancelled.availability < 0) {
            return;
        }
        if (!roomCancelled.room_type) {
            return;
        }
        if (!roomCancelled.date) {
            return;
        }
        const response = await fetch(`/api/hotel/view-availability/set-availability`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hotel_id: hotelId,
                requirements: [{
                room_type: roomCancelled?.room_type,
                availability: roomCancelled?.availability,
                date: roomCancelled?.date,
                }]
            }),
        });
        if (!response.ok) {
            setError(true);
        }
        const data = await response.json();
        setRooms(data);
    }


    useEffect(() => {
        console.log("Fetching rooms for hotelId:", hotelId);
        router.push(`/myHotels/fetch?hotelId=${hotelId}&roomManagement=true`);
        const fetchRooms = async () => {
        try {
            const res = await fetch(`/api/hotel/fetchRooms?hotelId=${hotelId}`);
            if (!res.ok) {
            throw new Error("Failed to fetch rooms");
            }
            const data = await res.json();
            console.log("Fetched rooms:", data);
            setRooms(data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
        };
    
        fetchRooms();
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error fetching rooms</div>;
    }
    return (
        <div className="mt-10 py-5 space-y-6">
            <SetRoomAvailability hotelId={hotelId} setRoomCancelled={setRoomCancelled} roomCancelled={roomCancelled}
                trigger={applyRoomFilter}
            />
            {rooms.map((room) => (
            <RoomWidget 
                key={room.room_number} 
                room={room} ></RoomWidget>
            ))}
        </div>
    );
}