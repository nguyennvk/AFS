import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(request){
    const city = request.nextUrl.searchParams.get('city');

    if (!city){
        return NextResponse.json({message: "Bad request, city must be specify"}, {status: 400})
    }
    
    try{
        var hotels = await prisma.hotel.findMany({
        where: {
            hotel_city: city
            }
        }) 
    } catch {
        return NextResponse.json({message: "Cannot query hotel table"}, {status: 500})
    }

    return NextResponse.json(hotels, {status: 200})

}
