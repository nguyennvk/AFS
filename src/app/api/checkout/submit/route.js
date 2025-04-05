import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import getReservation from "@/utils/getReservationById.js"
import getBooking from "@/utils/getFlightById.js"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

const prisma = new PrismaClient();

/*
{
    id: 3,
    bookings: [
        ABCE,
        ADFF      
    ],
    reservations: [
        1,
        2
    ]
}
*/

export async function POST(request){
    try{
        var paid_detail = await request.json()
        if (!paid_detail.bookings || !paid_detail.reservations){
            return NextResponse.json({error: "Must has bookings or reservations for checkout"}, {status: 400})
        }
        if (!Array.isArray(paid_detail.bookings) || !Array.isArray(paid_detail.reservations)){
            return NextResponse.json({error: "Bookings and reservations must be an array"}, {status: 400})
        }
    }
    catch{
        return NextResponse.json({error: "Bad request!!"}, {status: 400})
    }

    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
        const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
        if (!accessToken) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
    
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const { id } = decoded;
    console.log(paid_detail.reservations)

    const updatedBookings = await prisma.booking.updateMany({
        where: {
            booking_reference: { in: paid_detail.bookings }, // Matches any reference in the list
            customer_id: id
        },
        data: {
            status: "PAID" // Change to desired status
        }
        });
    const updatedReservations = await prisma.reservation.updateMany({
        where: {
            reservation_id: {in: paid_detail.reservations},
            customer_id: id
        },
        data: {
            status: "PAID"
        }
    })


    return NextResponse.json({updatedBookings, updatedReservations}, {status: 200})
}