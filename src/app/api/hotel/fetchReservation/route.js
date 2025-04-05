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
    // try{
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
        var room_type = request.nextUrl.searchParams.get('room_type')
         if (start_date=="" && end_date==""){
            var reservations = await prisma.reservation.findMany({
                where: {
                    hotel_id: hotel_id,
        
                },
                include: {
                    room: {
                        select: {
                            room_type: true,
                        },
                       
                    },
                }
                
            });
        }
        else if (end_date==""){
            var reservations = await prisma.reservation.findMany({
                where: {
                    hotel_id: hotel_id,
                    start_date: {
                        gte: start
                    }
                },
                include: {
                    room: {
                        select: {
                            room_type: true,
                        }
                    },
                }
                
            });
            }
        else if (start_date==""){
            var reservations = await prisma.reservation.findMany({
                where: {
                    hotel_id: hotel_id,
                    end_date: {
                        lte: end
                    }
                },
                include: {
                    room: {
                        select: {
                            room_type: true,
                        }
                    },
                }
                
            });
            }
        else if (start_date && end_date){
            var reservations = await prisma.reservation.findMany({
                where: {
                    hotel_id: hotel_id,
                    start_date: {
                        gte: start
                    },
                    end_date: {
                        lte: end
                    }
                },
                include: {
                    room: {
                        select: {
                            room_type: true,
                        }
                    },
                }
                
            });
            
        }
        if (room_type!==""){
            reservations = reservations.filter(reservation => reservation.room.room_type === room_type);
        }
        console.log(reservations)
        return NextResponse.json(reservations, {status: 200})

        
    // } catch{
        return NextResponse.json({error: "Bad request"}, {status: 400})
    // }
    
}   


