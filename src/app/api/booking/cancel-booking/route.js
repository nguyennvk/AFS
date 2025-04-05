import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import getReservation from "@/utils/getReservationById.js"
import getBooking from "@/utils/getFlightById.js"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const API_KEY = process.env.API_KEY; // Store securely in .env
const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL;

/*
{
    id: 1,
    bookings: [1, 2, 3]
}
*/

export async function POST(request){
    
    const cancel = await request.json()
    if (!cancel.bookings){
        return NextResponse.json({message: "Bad request, need to have id and bookings"}, {status: 400})
    }
    
    if (!Array.isArray(cancel.bookings)){
        return NextResponse.json({message: "Bad request, bookings must be a list"}, {status: 400})
    }
    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const { id } = decoded;
    if (!id){
        return NextResponse.json({error: "Internal Error"}, { status : 500})
    }
    const records = await prisma.reservation.findMany(
        {
            where: {
                reservation_id: {in: cancel.bookings}, 
                customer_id: parseInt(id)
            }
        }
    )

    const d = await prisma.reservation.deleteMany(
        {
            where: {
                reservation_id: {in: cancel.bookings}, 
                customer_id: parseInt(id)
            }
        }
    )

    for (const r of records){
        const owner = await prisma.hotel.findFirst({
            where: {
                hotel_id: r.hotel_id
            },
            select: {
                owner_id: true,
                hotel_name: true
            }
        }
    )

        await prisma.notification.create({
            data: {
                notification_type: "HOTEL_CANCEL",
                notification_message: "Your hotel reservation for room "+r.room_number+" at "+owner.hotel_name+" from "+r.start_date+" to "+r.end_date+"has been cancel",
                notification_date: new Date(),
                notification_read: false,
                account_id: parseInt(id)
            }
        }
        )

    

        await prisma.notification.create({
            data: {
                notification_type: "RESERVATION_CANCEL",
                notification_message: "A reservation for room "+r.room_number+" from "+r.start_date+" to "+r.end_date+"has been cancel",
                notification_date: new Date(),
                notification_read: false,
                account_id: owner.owner_id
            }
        }
        )
    }
    

    return NextResponse.json(d, {status: 200})
    


}