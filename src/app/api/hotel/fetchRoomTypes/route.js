// Need to talk with the log in sign in to see if this person is eligible to add hotel (check for token)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");
    try {
        const rooms = await prisma.room.findMany({
            where: {
                hotel_id: parseInt(hotelId)
            },
            distinct: ['room_type'],
            select:{
                room_type: true
            }
        });
        if (!rooms) {
            return NextResponse.json(
                { error: "Bad request" },
                { status: 400 }
            );
        }
        return NextResponse.json(rooms, { status: 200 });          
    } catch (error) {
        console.error("Error getting hotel:", error);
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 }
        );
    }

  }
