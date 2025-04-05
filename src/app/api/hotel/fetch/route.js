// Need to talk with the log in sign in to see if this person is eligible to add hotel (check for token)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId"); // Extracts "37"
      // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const { id } = decoded;
    try {
        const myHotels = await prisma.hotel.findFirst({
            where: {
                owner_id: parseInt(id),
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
