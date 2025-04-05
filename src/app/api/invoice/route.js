import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import getReservation from "@/utils/getReservationById.js"
import getBooking from "@/utils/getFlightById.js"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;


export async function GET(request){
    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const { id } = decoded;

    const invoice = {}

    const user_info = await prisma.account.findFirst({
        where: {
            account_id: parseInt(id)
        },
        select: {
            account_email: true,
            account_first_name: true,
            account_last_name: true,
            account_phone_number: true,
        }
    })

    if (!user_info.account_email || !user_info.account_first_name || !user_info.account_last_name || !user_info.account_phone_number){
        return NextResponse.json({message: "No invoice for this user"}, {status: 200})
    }

    invoice.first_name = user_info.account_first_name
    invoice.last_name = user_info.account_last_name
    invoice.email = user_info.account_email
    invoice.phone_number = user_info.account_phone_number

    const reservations = await getReservation(id, "PAID")
    if (reservations.status > 299)
    {
        return reservations
    }
    invoice.hotel = await reservations.json();
    for (const h of invoice.hotel){
        delete h.hotel_id
        delete h.customer_id
        delete h.status
    }

    const flights = await getBooking(id, "PAID")
    if (reservations.status>299){
        return flights
    }
    invoice.booking = await flights.json();
    for (const b of invoice.booking){
        delete b.firstName
        delete b.lastName
        delete b.email
        delete b.passportNumber
        delete b.status
        delete b.agencyId
        delete b.createdAt
        for (const f of b.flights){
            delete f.id
            delete f.originId
            delete f.destinationId
            delete f.duration
            delete f.availableSeats
            delete f.status
            const airline = f.airline.code
            f.airline = airline
            const origin = f.origin.code
            f.origin = origin
            const des = f.destination.code
            f.destination = des
        }

    }
    return NextResponse.json(invoice, {status: 200})

}