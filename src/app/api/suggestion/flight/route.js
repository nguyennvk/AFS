import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const API_KEY = process.env.API_KEY
const BASE_API_URL = process.env.BASE_API_URL
export async function GET(request){
    const origin = request.nextUrl.searchParams.get('origin');
    const destination = request.nextUrl.searchParams.get('destination');
    const date = request.nextUrl.searchParams.get('date')
    if (!origin || !destination || !date){
        return NextResponse.json({message: "Bad request, missing either origin, destination, or city"}, {status: 400})
    }
    try{
        const url = new URL(BASE_API_URL + "/api/flights");

        // Append query parameters
        url.searchParams.append("origin", origin);
        url.searchParams.append("destination", destination);
        url.searchParams.append("date", date);

        const response = await fetch(url, {
            method: "GET",
            headers: {
            "x-api-key": API_KEY,
            }
        })
        if (response.status <299){
            const flights = await response.json()
            return NextResponse.json(flights, {status:response.status})
        }
        else{
            return NextResponse.json({message: "Bad request"}, response.status)
        }

    } catch{
        return NextResponse.json({message: "Unknown error"}, {status: 520})
    }

}
