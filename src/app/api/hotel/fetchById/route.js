// Need to talk with the log in sign in to see if this person is eligible to add hotel (check for token)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");
    try {
        const myHotels = await prisma.hotel.findFirst({
            where: {
                hotel_id: parseInt(hotelId)
            }
        });
        if (!myHotels) {
            return NextResponse.json(
                { error: "Bad request" },
                { status: 400 }
            );
        }
        return NextResponse.json(myHotels, { status: 200 });          
    } catch (error) {
        console.error("Error getting hotel:", error);
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 }
        );
    }

  }
