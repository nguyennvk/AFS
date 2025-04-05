import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import getReservation from "@/utils/getReservationById.js"
import getBooking from "@/utils/getFlightById.js"
import verifyUser from "@/utils/verifyUser"

const API_KEY = process.env.API_KEY; // Store securely in .env
const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL;

export async function GET(request){
    
    try{
        // Verify
        const isValid = verifyUser(request)
        if (isValid.status>299){
            return isValid
        }
        const check = await isValid.json()
        if (!check.valid){
            return isValid
        }
        var id = check.id
    }
    catch{
        return NextResponse.json({error: "Unable to get id"}, {status: 400})
    }
    
    try{
        var bookings = await prisma.booking.findMany({
            where: {
                customer_id: parseInt(id),
            },
            select: {
                booking_reference: true
            }
        })
        if (!bookings){
            return NextResponse.json({message: "You have no flight booking"}, {status: 200})
        }
    } catch{
        return NextResponse.json({error: "Bad request, invalid id or id does not exist"}, {status: 400})
    }
    try{
        var last_name = await prisma.account.findFirst({
            where: {
                account_id: parseInt(id)
            },
            select: {
                account_last_name: true
            }
        })    
        if (!last_name){
            return NextResponse.json({error: "Bad request, invalid user"}, {status: 400})
        }
    } catch{
        return NextResponse.json({error: "Bad request, invalid id or id does not exist"}, {status: 400})
    }

    const verify = []
    
    for (const b of bookings){
        const url = new URL(BASE_API_URL + "/api/bookings/retrieve");
        
        // Append query parameters
        url.searchParams.append("lastName", last_name.account_last_name);
        url.searchParams.append("bookingReference", b.booking_reference);
        console.log(url)
        const response = await fetch(url, {
            method: "GET",
            headers: {
            "x-api-key": API_KEY,
            }
        })
        if (!response){
            return NextResponse.json({error: "Bad request, unable to connect to AFS"}, {status: 400})
        }
        if (response.status > 299){
            return NextResponse.json(response, {status: response.status})
        }
        if (response.status <299){
            const flights = await response.json()
            verify.push(flights)
        }
        else{
            return NextResponse.json({message: "Bad request"}, response.status)
        }
    }
    return NextResponse.json(verify, {status: 200})

}