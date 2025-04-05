import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { parse } from "path";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();

export async function GET(request, {params}){
    
      // Verify
      const cookieStore = await cookies(); // Retrieve the cookie store
      const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
      if (!accessToken) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const decoded = jwt.verify(accessToken, SECRET_KEY);
      const { id } = decoded;
    try{

        var hotel_id = parseInt(request.nextUrl.searchParams.get('hotel_id'))
        const checkOwnership = await prisma.hotel.findUnique({
          where: {
              owner_id: parseInt(id),
              hotel_id: hotel_id
          }
      });
      if (!checkOwnership) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
        const start_date = request.nextUrl.searchParams.get('start')
        const end_date = request.nextUrl.searchParams.get('end')
        var start = new Date(start_date)
        var end = new Date(end_date)
        if (!start || !end || end<start){
            return NextResponse.json({error: "Bad request, need to specify start and end and start<end"}, {status: 400})
        }
    } catch{
        return NextResponse.json({error: "Bad request"}, {status: 400})
    }

    const availableRooms = await prisma.room.groupBy({
        by: ["room_type"], // Group by room_type
        _count: { room_type: true }, // Count number of rooms per type
        where: {
          hotel_id: hotel_id, // Filter by hotel_id
          reservation: {
            every: {
              OR: [
                { start_date: { gt: end } }, // Reservation starts after the requested end date
                { end_date: { lt: start } }  // Reservation ends before the requested start date
              ]
            }
          }
        }
      });
      
    console.log(availableRooms)
    return NextResponse.json(availableRooms, {status: 200})
      


}