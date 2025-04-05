import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const country = searchParams.get("country");

        const cities = await prisma.city.findMany({
            where: {
                country: country
            },
            select: {
                city: true
            },
            orderBy: {
                country: 'asc',
              }            
        });
        const c = cities.map(city => city.city);
        return NextResponse.json(c, { status: 200 });
    } catch (error) {
        console.error("Error fetching random hotels:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
