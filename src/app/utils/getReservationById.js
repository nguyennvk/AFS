import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { differenceInDays } from 'date-fns';

const prisma = new PrismaClient();

export default async function getReservation(id, status){
    try{
        if (status===undefined){
            var reservations = await prisma.reservation.findMany({
                where: {
                    customer_id: parseInt(id),
                }
            })
        }
        else{
            // handle revervation
            var reservations = await prisma.reservation.findMany({
                where: {
                    customer_id: parseInt(id),
                    status: status
                }
            })
        }
    } catch{
        return NextResponse.json({erorr: "Bad request, the provided id may not appear in the database"}, {status: 400})
    }
    for (const r of reservations){
        try {
            const reservedRoom = await prisma.room.findFirst({
                where: {
                    room_number: r.room_number,
                    hotel_id: r.hotel_id
                },
                select: {
                    room_price: true,
                    room_type: true
                }
            })
            const nights = differenceInDays(r.end_date, r.start_date);
            r.total_price = nights*reservedRoom.room_price 
            r.room_type = reservedRoom.room_type
            const hotel = await prisma.hotel.findFirst({
                where: {
                    hotel_id: r.hotel_id,
                },
                select: {
                    hotel_name: true
                }
            })
            r.hotel_name = hotel.hotel_name
        }
        catch{
            return NextResponse.json({error: "Bad request incorrect room number or hotel id"}, {status: 400})
        }
    }
    return NextResponse.json(reservations, {status: 200})
}
