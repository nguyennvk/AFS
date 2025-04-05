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

export async function GET(request){
    
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
   
    const booking = {}
    const reservations = await getReservation(id)
    if (reservations.status > 299){
        return reservations
    }
    booking.reservations = await reservations.json()

    const flights = await getBooking(id)
    if (reservations.status>299){
        return flights
    }
    booking.flights = await flights.json();
    

    return NextResponse.json(booking, {status: 200})
}