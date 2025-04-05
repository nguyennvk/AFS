import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const API_KEY = process.env.API_KEY; // Store securely in .env
const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL;

export default async function getHotelId(id){
    try{
        const hotel = await prisma.hotel.findFirst({
            where: {
                owner_id: parseInt(id)
            },
            select: {
                hotel_id: true
            }
        })
        return NextResponse.json({id: parseInt(hotel.hotel_id)}, {status: 200})
    } catch{
        return NextResponse.json({error: "Bad request"}, {status: 400})
    }
    
}