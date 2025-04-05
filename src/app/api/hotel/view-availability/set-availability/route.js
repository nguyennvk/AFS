import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const API_KEY = process.env.API_KEY; // Store securely in .env
const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL;
/*
{
    id: 1,
    requirements: 
        [
            {
                room_type: "king",
                availability: 3,
                date: "2025-03-21"
            },
            {
                room_type: "king bed twin",
                availability: 4,
                date: "2025-06-06"
            }   
        ]
   

}
*/
export async function POST(request){
    
    // try{
        var requirement = await request.json()

        if (!requirement.requirements){
            return NextResponse.json({error: "Bad request, need to specify id and requirements"}, {status: 400})
        }
        if (!Array.isArray(requirement.requirements)){
            return NextResponse.json({error: "Bad request, requirements must be a list"}, {status: 400})
        }
        // Verify
        const cookieStore = await cookies(); // Retrieve the cookie store
        const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
        if (!accessToken) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        const { id } = decoded;
    
        // }
    //  catch{
        // return NextResponse.json({error: "Bad request"}, {status: 400})
    // }

    var hotel_id = parseInt(requirement.hotel_id)
    
    // try{

        const allRooms = await prisma.room.groupBy({
            by: ["room_type"],
            _count: { room_type: true },
            where: {
                hotel_id: hotel_id
            }
        })
        const capacity = Object.fromEntries(
            allRooms.map(item => [item.room_type, item._count.room_type])
        );

        
        for(const r of requirement.requirements){
            if (!r.date || !r.room_type || !r.availability){
                return NextResponse.json({error: "Bad request, missing either room_type, date, availability"}, {status: 400})
            }

            if (!capacity[r.room_type]){
                return NextResponse.json({error: "Bad request, invalid room_type"}, {status: 400})
            }

            const date = new Date(r.date)

                const availableRooms = await prisma.room.groupBy({
                    by: ["room_type"], // Group by room_type
                    _count: { room_type: true }, // Count number of rooms per type
                    where: {
                      hotel_id: hotel_id, // Filter by hotel_id
                      reservation: {
                        every: {
                          OR: [
                            { start_date: { gt:  date} }, // Reservation starts after the requested end date
                            { end_date: { lt: date } }  // Reservation ends before the requested start date
                          ]
                        }
                      }
                    }
                  });
                const free = Object.fromEntries(
                    availableRooms.map(item => [item.room_type, item._count.room_type])
                );
    
            if (r.availability > free[r.room_type]){
                const num_delete = parseInt(r.availability)-free[r.room_type]
                if (num_delete > 0){
                    const reservationsToDelete = await prisma.reservation.findMany({
                        where: { 
                            hotel_id: hotel_id ,
                            room: { room_type: r.room_type}, 
                            AND: [
                                { start_date: { lte:  date} }, // Reservation starts after the requested end date
                                { end_date: { gte: date } }  // Reservation ends before the requested start date
                                ]},  
                        take: num_delete,               
                        select: { reservation_id: true, customer_id: true, room_number: true, start_date: true, end_date: true }
                        });
                    console.log(reservationsToDelete)
                    if (reservationsToDelete.length>0){
                        const records = await prisma.reservation.deleteMany({
                            where: {
                                reservation_id: { in: reservationsToDelete.map(a => a.reservation_id) }
                            }
                            });

                        for (const r of reservationsToDelete){

                            await prisma.notification.create({
                                data: {
                                    notification_type: "HOTEL_CANCEL",
                                    notification_message: "Your hotel reservation for room "+r.room_number+" from "+r.start_date+" to "+r.end_date+"has been cancel",
                                    notification_date: new Date(),
                                    notification_read: false,
                                    account_id: parseInt(r.customer_id)
                                }
                            }
                            )
                            
                        }
                                            
                    }
                }
            }            
              
        }

        return NextResponse.json({message: "Successfully preserver room"}, {status: 200})
          
        

    // } catch{ 
        return NextResponse.json({error: "Bad request, invalid id"}, {status: 400})
    // }


}