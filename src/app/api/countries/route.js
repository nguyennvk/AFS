import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function GET() {
    try {
        const countries = await prisma.city.findMany({
            select: {
                country: true
            },
            distinct: ['country'],
            orderBy: {
                country: 'asc',
              }            
        });
        const c = countries.map(country => country.country);
        return NextResponse.json(c, { status: 200 });
    } catch (error) {
        console.error("Error fetching random hotels:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
