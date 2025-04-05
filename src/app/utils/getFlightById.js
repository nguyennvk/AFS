import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { differenceInDays } from 'date-fns';

const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL
const API_KEY = process.env.API_KEY
export default async function getBooking(id, status){
    try{
        if (status===undefined){
            var bookings = await prisma.booking.findMany({
                where: {
                    customer_id: parseInt(id),
                }
            })
        }
        else{
            var bookings = await prisma.booking.findMany({
                where: {
                    customer_id: parseInt(id),
                    status: status
                }
            })
        }
    } catch{
        return NextResponse.json({error: "Bad request"}, {status: 400})
    }

    // handle flight booking
    try {
        var customer_lastName = await prisma.account.findFirst({
            where: {
                account_id: parseInt(id)
            },
            select: {
                account_last_name: true
            }
        })
    }
    catch{
        return NextResponse.json({error: "Bad request"}, {status: 400})
    }
    const flights = []
    for (const b of bookings){
        const url = new URL(BASE_API_URL + "/api/bookings/retrieve");

        // Append query parameters
        url.searchParams.append("lastName", customer_lastName.account_last_name);
        url.searchParams.append("bookingReference", b.booking_reference);
        try{
        const response = await fetch(url, {
            method: "GET",
            headers: {
            "x-api-key": API_KEY,
            }
        });
        const d = await response.json()
        flights.push(d)
        } catch{
            return NextResponse.json({error: "Bad request, something wrong with the AFS"}, {status: response.status})
        }
    }
    return NextResponse.json(flights, {status: 200})
}
