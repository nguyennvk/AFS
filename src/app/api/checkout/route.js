import { NextResponse } from "next/server";
import getReservation from "@/utils/getReservationById.js"
import getBooking from "@/utils/getFlightById.js"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request){
    try{
        // Verify
        const cookieStore = await cookies(); // Retrieve the cookie store
        const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
        if (!accessToken) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        var { id } = decoded;
        if (!id){
            return NextResponse.json({error: "Misisng id attribute"}, {status: 400})
        }
    }
    catch{
        return NextResponse.json({error: "Unable to get id"}, {status: 400})
    }
    const checkout = {}
    const reservations = await getReservation(id, "UNPAID")
    if (reservations.status > 299)
    {
        return reservations
    }
    checkout.hotel = await reservations.json();

    // handle booking
    const flights = await getBooking(id, "UNPAID")
    if (reservations.status>299){
        return flights
    }
    checkout.flights = await flights.json();

    

    return NextResponse.json(checkout, {status: 200})
}