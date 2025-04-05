import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


const API_KEY = process.env.API_KEY; // Store securely in .env
const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL;
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;


export async function POST(request){

    //Authentication first

    try{
        var dataFetch =  await request.json();
    }
    catch{
        return NextResponse.json({error: "Bad Request, there is some missing values or the wrong format"}, {status: 400})
    }

    if (dataFetch.flightIds.length===0 && dataFetch.hotel_id==null){
        return NextResponse.json({error: "Bad Request"}, {status: 400})
    }

    if (new Date(dataFetch.end_date)<new Date(dataFetch.start_date)){
        return NextResponse.json({error: "Bad request, start date must be before end date"}, {status: 400})
    }
    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const { id } = decoded;
    if (!id){
        return NextResponse.json({error: "Internal Error"}, { status : 500})
    }

    if (dataFetch?.hotel_id!=null){
        try{
            if (!dataFetch.start_date || !dataFetch.end_date){
                return NextResponse.json({error: "Bad Request, need to specify start and end date"}, {status: 400})
            }
            const reservations = await prisma.reservation.findMany({
                where: {
                  hotel_id: parseInt(dataFetch.hotel_id),
                  room_number: dataFetch.room_number,
                },
                select: {
                  start_date: true,
                  end_date: true,
                },
              });
            for (const x of reservations){
                const s = new Date(dataFetch.start_date)
                const e = new Date(dataFetch.end_date)
                if ((x.start_date <= s && s <= x.end_date) || (x.start_date <= e && e<= x.end_date)){
                    return NextResponse.json({error: "This room has been booked on your time slot"}, {status: 400})
                }
            }
            var hotel_name = await prisma.hotel.findUnique({
                            where: {hotel_id: parseInt(dataFetch.hotel_id)},
                            select: {hotel_name: true}
                        })
            
            const reserve = await prisma.reservation.create({
                data: {
                    hotel_id: parseInt(dataFetch.hotel_id),
                    room_number: dataFetch.room_number,
                    customer_id: id,
                    start_date: new Date(dataFetch.start_date),
                    end_date: new Date(dataFetch.end_date),
                    status: "UNPAID"
                }
            })

            // Notifiy user
            const noti_user = await prisma.notification.create({
                data: {
                    notification_type: "HOTEL",
                    notification_message: "You have booked hotel "+hotel_name.hotel_name+" at room "+dataFetch.room_number+" from "+dataFetch.start_date+" to "+dataFetch.end_date,
                    notification_date: new Date(),
                    notification_read: false,
                    account_id: id
                }
            })
            // Notify hotel owner

            const owner_id = await prisma.hotel.findUnique({
                where: {
                    hotel_id: parseInt(dataFetch.hotel_id)
                },
                select: {
                    owner_id: true
                }
            })

            const noti_owner = await prisma.notification.create({
                data: {
                    notification_type: "HOTEL",
                    notification_message: "A reservation has been made for your hotel, "+hotel_name.hotel_name+", at room "+dataFetch.room_number+" from "+dataFetch.start_date+" to "+dataFetch.end_date,
                    notification_date: new Date(),
                    notification_read: false,
                    account_id: owner_id.owner_id
                }
            })

        } catch{
            return NextResponse.json({error: "Bad Request"}, {status: 400})
        }
    }


    if (dataFetch.flightIds.length>0){
        try{
            console.log("asdfaksbd")
 
            const response = await fetch(BASE_API_URL+"/api/bookings", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                },
                body: JSON.stringify({
                firstName: dataFetch.firstName,
                lastName: dataFetch.lastName,
                email: dataFetch.email,
                passportNumber: dataFetch.passportNumber,
                flightIds: dataFetch.flightIds
                }),
            });
            

            const d = await response.json()
            console.log(d)
            const b = await prisma.booking.create({
                data: {
                  customer_id: id,
                  booking_reference: d.bookingReference,
                  status: "UNPAID"
                }
              });
            let info;
            if (dataFetch.hotel_id == null){
                return NextResponse.json(d, {status: response.status});
            }
            else if (dataFetch.hotel_id!=null){
                info = {
                    ...d,
                    hotel: {
                    name: hotel_name.hotel_name,
                    room: dataFetch.room_number,
                    start_date: dataFetch.start_date,
                    end_date: dataFetch.end_date
                    }
                };
                }

            
            return NextResponse.json(info, {status: response.status})
          
        } catch{
            return NextResponse.json({error: "Bad Request, fail booking may be flight is full"}, {status: 400})
        }
        
    }
    const hotel_info = {hotel: {
        name: hotel_name.hotel_name,
        room: dataFetch.room_number,
        start_date: dataFetch.start_date,
        end_date: dataFetch.end_date
        }}
    return NextResponse.json(hotel_info, {status: 200})


    

}