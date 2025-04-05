import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// interface Hotel {
//     hotel_id: number;
//     hotel_name: string;
//     hotel_image: string;
//     hotel_description: string;
//   }

export async function GET() {
    try {
        // Get random hotels from DB
        const randomHotels = await prisma.$queryRaw`SELECT * FROM (
            SELECT DISTINCT * FROM "Hotel" LIMIT 10
        ) AS subquery
        ORDER BY RANDOM()
        LIMIT 8;
        `;;
        return NextResponse.json(randomHotels, { status: 200 });
    } catch (error) {
        console.error("Error fetching random hotels:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
