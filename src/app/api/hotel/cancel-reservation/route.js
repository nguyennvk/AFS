import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();

/*
{
    id: 1,
    reservations: [1, 2, 3]
}
 */

export async function POST(request){
    
    const cancel_reservation = await request.json()
    console.log(cancel_reservation)
    if (!Array.isArray(cancel_reservation.reservations)){
        return NextResponse.json({message: "Bad request, reservations must be a list"}, {status: 400})
    }
    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const { id } = decoded;
    const hotel_id = parseInt(cancel_reservation.hotel_id)
    if (!hotel_id){
        return NextResponse.json({message: "Bad request, must include hotel_id"}, {status: 400})
    }

    const checkOwnership = await prisma.hotel.findUnique({
        where: {
            owner_id: parseInt(id),
            hotel_id: hotel_id
        }
    });
    if (!checkOwnership) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const records = await prisma.reservation.findMany(
        {
            where: {
                reservation_id: {in: cancel_reservation.reservations},
                hotel_id: hotel_id, 
            }
        }
    )

    const d = await prisma.reservation.deleteMany(
        {
            where: {
                reservation_id: {in: cancel_reservation.reservations},
                hotel_id: hotel_id
            }
        }
    )
    console.log(d)

    for (const r of records){

        await prisma.notification.create({
            data: {
                notification_type: "HOTEL_CANCEL",
                notification_message: "Your hotel reservation for room "+r.room_number+" from "+r.start_date+" to "+r.end_date+"has been cancel",
                notification_date: new Date(),
                notification_read: false,
                account_id: parseInt(r.customer_id)
            }
        }
        )
        
    }
    return NextResponse.json(records, {status: 200})

}